import { Injectable } from "@nestjs/common";
import Stripe from "stripe";
import { StripeService } from "@payments/core/stripe/stripe.service";
import { StripeConfig } from "@payments/core/stripe/stripe.config";
import { PaymentProvidersEnum, planIntervalsInDays, TransactionStatusEnum } from "@libs/contracts/index";
import { BadRequestRpcException } from "@libs/exeption/rpc-exeption";
import { PlanService } from "../plan/plan.service";
import { TransactionService } from "../transaction/transaction.service";
import { SubscriptionService } from "../subscription/subscription.service";

@Injectable()
export class WebhookStripeService {
	constructor(
		private readonly stripeService: StripeService,
		private readonly stripeConfig: StripeConfig,
		private readonly planService: PlanService,
		private readonly transactionService: TransactionService,
		private readonly subscriptionService: SubscriptionService,
	) {}

	async receiveWebhookStripe(event: Stripe.Event) {
		console.log("[WEBHOOK STRIPE EVENT]", event.type);

		// если checkout сессия завершена успешно
		if (event.type === "checkout.session.completed") {
			const invoice = event.data.object as Stripe.Checkout.Session;
			await this.handleSuccessCheckoutSession(invoice);
		}

		// если checkout сессия истекла
		if (event.type === "checkout.session.expired") {
			const session = event.data.object as Stripe.Checkout.Session;
			await this.handleExpiredCheckoutSession(session);
		}

		// если checkout сессия неудачная
		if (event.type === "checkout.session.async_payment_failed") {
			const session = event.data.object as Stripe.Checkout.Session;
			await this.handleFailedCheckoutSession(session);
		}

		// если invoice сессия успешно оплачена(автооплата подписки)
		if (event.type === "invoice.payment_succeeded") {
			const invoice = event.data.object as Stripe.Invoice;
			if (invoice.billing_reason === "subscription_cycle") {
				await this.handleInvoicePaymentSucceeded(invoice);
			}
		}

		// если invoice сессия неудачно оплачена(автооплата подписки)
		if (event.type === "invoice.payment_failed") {
			const invoice = event.data.object as Stripe.Invoice;
			if (invoice.billing_reason === "subscription_cycle") {
				await this.handleInvoicePaymentFailed(invoice);
			}
		}
	}

	// Валидация вебхука для stripe
	async constructStripeEvent(payload: any, signature: string) {
		if (!payload) {
			throw new BadRequestRpcException("No webhook payload provided");
		}
		if (!signature) {
			throw new BadRequestRpcException("No webhook signature provided");
		}
		if (!this.stripeConfig.stripeWebhookSecret) {
			throw new BadRequestRpcException("Stripe webhook secret not configured");
		}
		// библиотека сама валидирует подпись
		return this.stripeService.webhooks.constructEvent(payload, signature, this.stripeConfig.stripeWebhookSecret);
	}

	// Обработка успешного checkout сессии
	private async handleSuccessCheckoutSession(session: Stripe.Checkout.Session) {
		// получаем данные из metadata
		const planId = session.metadata?.planId;
		const userId = session.metadata?.userId;
		const startedAt = new Date(session.created * 1000);

		if (!planId || !userId) {
			throw new BadRequestRpcException("Plan ID is required");
		}

		// получаем план из БД
		const plan = await this.planService.findPlanById(+planId);

		// вычисляем дату окончания подписки
		const expiresAt = new Date(startedAt);
		expiresAt.setDate(expiresAt.getDate() + planIntervalsInDays[plan.interval]);

		// todo нужно подумать как сделать транзакцию здесь если упадет updateTransaction
		// создаем подписку
		await this.subscriptionService.createSubscription({
			planId: +planId,
			userId: userId as string,
			stripeSubscriptionId: session.subscription as string,
			paypalSubscriptionId: null,
			createdAt: startedAt,
			expiresAt: expiresAt,
		});

		// обновляем статус транзакции
		await this.transactionService.updateTransaction(session.id, PaymentProvidersEnum.STRIPE, {
			status: TransactionStatusEnum.SUCCESS,
			stripeSubscriptionId: session.subscription as string,
			createdAt: startedAt,
			expiresAt: expiresAt,
		});

		// создаем событие в таблице outboxEvents
		await this.transactionService.createOutboxTransactionEvent({
			sessionId: session.id as string,
			planId: +planId,
			userId: userId as string,
			provider: "STRIPE",
			expiresAt: expiresAt,
		});

		// todo отправить юзеру письмо о подписке. пометить юзера в бд как премиум
	}

	// Обработка неудачной checkout сессии
	private async handleFailedCheckoutSession(session: Stripe.Checkout.Session) {
		await this.transactionService.updateTransaction(session.id, PaymentProvidersEnum.STRIPE, {
			status: TransactionStatusEnum.FAILED,
		});
	}

	// Обработка истекшей checkout сессии
	private async handleExpiredCheckoutSession(session: Stripe.Checkout.Session) {
		await this.transactionService.updateTransaction(session.id, PaymentProvidersEnum.STRIPE, {
			status: TransactionStatusEnum.EXPIRED,
		});
	}

	// Обработка успешного invoice сессии(автооплата подписки)
	private async handleInvoicePaymentSucceeded(session: Stripe.Invoice) {
		// получаем данные из сессии
		const startedAt = new Date(session.period_start * 1000);
		const expiresAt = new Date(session.period_end * 1000);
		const { planId, userId } = session.parent?.subscription_details?.metadata as { planId: string; userId: string };
		const subscriptionId = session.parent?.subscription_details?.subscription || null;

		// получаем план из БД
		const plan = await this.planService.findPlanById(+planId);
		// получаем подписку из БД
		const currentSubscriptionFromDb = await this.subscriptionService.getSubscriptionByUserId(userId as string);

		// создаем успешную транзакцию(платеж) в бд
		await this.transactionService.createTransaction({
			userId,
			plan,
			stripeSubscriptionId: subscriptionId as string,
			stripeSessionId: session.id as string,
			paypalSessionId: null,
			paypalPlanId: null,
			provider: PaymentProvidersEnum.STRIPE,
			status: TransactionStatusEnum.SUCCESS,
			createdAt: startedAt,
			expiresAt: expiresAt,
		});

		// обновляем подписку в бд - продлеваем подписку
		await this.subscriptionService.updateSubscription(currentSubscriptionFromDb.id, {
			expiresAt: expiresAt,
		});

		// создаем событие в таблице outboxEvents
		await this.transactionService.createOutboxTransactionEvent({
			sessionId: session.id as string,
			planId: +planId,
			userId: userId as string,
			provider: "STRIPE",
			expiresAt: expiresAt,
		});
	}

	// Обработка неудачной invoice сессии(автооплата подписки)
	private async handleInvoicePaymentFailed(session: any) {
		// получаем данные из сессии
		const startedAt = new Date(session.period_start * 1000);
		const expiresAt = new Date(session.period_end * 1000);
		const { planId, userId } = session.parent.subscription_details.metadata;
		const subscriptionId = session.parent.subscription_details.subscription;
		// получаем подписку из БД
		const currentSubscriptionFromDb = await this.subscriptionService.getSubscriptionByUserId(userId as string);
		// получаем план из БД
		const plan = await this.planService.findPlanById(+planId);
		// отменяем подписку в stripe
		await this.stripeService.subscriptions.cancel(subscriptionId);
		// создаем неудачную транзакцию(платеж) в бд
		await this.transactionService.createTransaction({
			userId,
			plan,
			stripeSubscriptionId: subscriptionId,
			stripeSessionId: session.id,
			paypalSessionId: null,
			paypalPlanId: null,
			provider: PaymentProvidersEnum.STRIPE,
			status: TransactionStatusEnum.FAILED,
			createdAt: startedAt,
			expiresAt: expiresAt,
		});

		// удаляем подписку в бд
		await this.subscriptionService.deleteSubscription(currentSubscriptionFromDb.id);

		//todo отправить юзеру письмо о неудачной оплате, перевести юзера на бесплатный план
	}
}

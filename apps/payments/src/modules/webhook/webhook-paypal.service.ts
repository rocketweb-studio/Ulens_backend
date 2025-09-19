import { Injectable } from "@nestjs/common";
import { PlanService } from "../plan/plan.service";
import { TransactionService } from "../transaction/transaction.service";
import { SubscriptionService } from "../subscription/subscription.service";
import { PaymentProvidersEnum, planIntervalsInDays, TransactionStatusEnum } from "@libs/contracts/index";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";

@Injectable()
export class WebhookPaypalService {
	constructor(
		private readonly planService: PlanService,
		private readonly transactionService: TransactionService,
		private readonly subscriptionService: SubscriptionService,
	) {}

	async receiveWebhookPayPal(eventType: string, resource: any) {
		console.log("[WEBHOOK PAYPAL EVENT TYPE]", eventType);
		// обработка активации подписки
		if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
			await this.handleSubscriptionActivated(resource);
		}

		// обработка успешного платежа при первой оплате и при автопродлении
		if (eventType === "PAYMENT.SALE.COMPLETED") {
			await this.handlePaymentCompleted(resource);
		}

		// обработка неудачного платежа
		if (eventType === "PAYMENT.SALE.DENIED") {
			await this.handlePaymentFailed(resource);
		}

		// обработка приостановки подписки
		if (eventType === "BILLING.SUBSCRIPTION.SUSPENDED") {
			await this.handleSubscriptionSuspended(resource);
		}

		// обработка окончания подписки
		if (eventType === "BILLING.SUBSCRIPTION.EXPIRED") {
			await this.handleSubscriptionExpired(resource);
		}
	}

	private async handleSubscriptionActivated(resource: any) {
		const { userId, planId } = JSON.parse(resource.custom_id);

		// получаем план из БД
		const plan = await this.planService.findPlanById(+planId);

		const startedAt = new Date(resource.create_time);
		// вычисляем дату окончания подписки
		const expiresAt = new Date(startedAt);
		expiresAt.setDate(expiresAt.getDate() + planIntervalsInDays[plan.interval]);

		const existingSubscription = await this.subscriptionService.getSubscriptionByUserId(userId);
		// если подписка не существует, то создаем ее
		if (!existingSubscription) {
			// создаем подписку
			await this.subscriptionService.createSubscription({
				planId: +planId,
				userId: userId as string,
				stripeSubscriptionId: null,
				paypalSubscriptionId: resource.id,
				createdAt: startedAt,
				expiresAt: expiresAt,
			});
			// иначе подписка уже была создана и значит событие пришло потому-что либо это повторный вебхук от paypal, либо это включение автопродления подписки
		} else {
			// обновляем подписку в бд - включаем автопродление подписки
			await this.subscriptionService.updateSubscription(existingSubscription.id, { isAutoRenewal: true });
		}
		// todo отправить юзеру письмо о подписке. пометить юзера в бд как премиум
	}

	private async handlePaymentCompleted(resource: any) {
		const { planId, transactId, userId } = JSON.parse(resource.custom);

		// получаем план из БД
		const plan = await this.planService.findPlanById(planId);

		const startedAt = new Date(resource.create_time);
		// вычисляем дату окончания подписки
		const expiresAt = new Date(startedAt);
		expiresAt.setDate(expiresAt.getDate() + planIntervalsInDays[plan.interval]);

		const transaction = await this.transactionService.findTransactionById(transactId);
		// если транзакция есть но не завершена, то обновляем статус транзакции
		if (
			transaction &&
			transaction.status === TransactionStatusEnum.PENDING &&
			transaction.provider === PaymentProvidersEnum.PAYPAL &&
			!transaction.paypalSessionId
		) {
			// обновляем статус транзакции
			await this.transactionService.updateTransaction(transactId, PaymentProvidersEnum.PAYPAL, {
				status: TransactionStatusEnum.SUCCESS,
				paypalPlanId: resource.plan_id,
				paypalSessionId: resource.id,
				createdAt: startedAt,
				expiresAt: expiresAt,
			});
			// если первая транзакция уже завершена, и вебхук пришел не для нее, то создаем новую транзакцию
		} else if (
			transaction &&
			transaction.status !== TransactionStatusEnum.PENDING &&
			transaction.provider === PaymentProvidersEnum.PAYPAL &&
			transaction.paypalSessionId !== resource.id
		) {
			// создаем новую транзакцию(платеж) в бд
			await this.transactionService.createTransaction({
				userId,
				plan,
				stripeSubscriptionId: null,
				stripeSessionId: null,
				paypalSessionId: resource.id,
				paypalPlanId: resource.plan_id,
				provider: PaymentProvidersEnum.PAYPAL,
				status: TransactionStatusEnum.SUCCESS,
				createdAt: startedAt,
				expiresAt: expiresAt,
			});

			const currentSubscriptionFromDb = await this.subscriptionService.getSubscriptionByUserId(userId as string);
			// обновляем подписку в бд - продлеваем подписку
			await this.subscriptionService.updateSubscription(currentSubscriptionFromDb.id, {
				expiresAt: expiresAt,
			});
		}
	}

	private async handlePaymentFailed(resource: any) {
		const { planId, transactId, userId } = JSON.parse(resource.custom);

		// получаем план из БД
		const plan = await this.planService.findPlanById(planId);

		const startedAt = new Date(resource.create_time);
		// вычисляем дату окончания подписки
		const expiresAt = new Date(startedAt);
		expiresAt.setDate(expiresAt.getDate() + planIntervalsInDays[plan.interval]);

		const transaction = await this.transactionService.findTransactionById(transactId);
		// если транзакция есть но не завершена, то обновляем статус транзакции
		if (
			transaction &&
			transaction.status === TransactionStatusEnum.PENDING &&
			transaction.provider === PaymentProvidersEnum.PAYPAL &&
			!transaction.paypalSessionId
		) {
			// обновляем статус транзакции
			await this.transactionService.updateTransaction(transactId, PaymentProvidersEnum.PAYPAL, {
				status: TransactionStatusEnum.FAILED,
				paypalPlanId: resource.plan_id,
				paypalSessionId: resource.id,
				createdAt: startedAt,
				expiresAt: expiresAt,
			});
			// если первая транзакция уже завершена, и вебхук пришел не для нее, то создаем новую транзакцию
		} else if (
			transaction &&
			transaction.status !== TransactionStatusEnum.PENDING &&
			transaction.provider === PaymentProvidersEnum.PAYPAL &&
			transaction.paypalSessionId !== resource.id
		) {
			// создаем новую транзакцию(платеж) в бд
			await this.transactionService.createTransaction({
				userId,
				plan,
				stripeSubscriptionId: null,
				stripeSessionId: null,
				paypalSessionId: resource.id,
				paypalPlanId: resource.plan_id,
				provider: PaymentProvidersEnum.PAYPAL,
				status: TransactionStatusEnum.FAILED,
				createdAt: startedAt,
				expiresAt: expiresAt,
			});
		}
	}

	private async handleSubscriptionSuspended(resource: any) {
		const { userId } = JSON.parse(resource.custom_id);

		const subscription = await this.subscriptionService.getSubscriptionByUserId(userId);
		if (!subscription) {
			throw new NotFoundRpcException("Subscription not found");
		}
		await this.subscriptionService.updateSubscription(subscription.id, { isAutoRenewal: false });
	}

	private async handleSubscriptionExpired(resource: any) {
		const { userId } = JSON.parse(resource.custom_id);

		const subscription = await this.subscriptionService.getSubscriptionByUserId(userId);
		if (!subscription) {
			throw new NotFoundRpcException("Subscription not found");
		}
		await this.subscriptionService.deleteSubscription(subscription.id);

		// todo отправить юзеру письмо об окончании подписки. пометить юзера в бд как премиум
	}
}

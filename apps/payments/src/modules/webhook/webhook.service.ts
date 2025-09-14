import { Injectable } from "@nestjs/common";
import Stripe from "stripe";
import { StripeService } from "@payments/core/stripe/stripe.service";
import { StripeConfig } from "@payments/core/stripe/stripe.config";
import { PaymentIntervalsEnum, TransactionStatusEnum } from "@libs/contracts/index";
import { BadRequestRpcException, NotFoundRpcException, UnexpectedErrorRpcException } from "@libs/exeption/rpc-exeption";
import { PlanService } from "../plan/plan.service";
import { TransactionService } from "../transaction/transaction.service";
import { SubscriptionService } from "../subscription/subscription.service";

@Injectable()
export class WebhookService {
	constructor(
		private readonly stripeService: StripeService,
		private readonly stripeConfig: StripeConfig,
		private readonly planService: PlanService,
		private readonly transactionService: TransactionService,
		private readonly subscriptionService: SubscriptionService,
	) {}

	async receiveWebhookStripe(event: Stripe.Event) {
		const session = event.data.object as Stripe.Checkout.Session;

		if (event.type === "checkout.session.completed") {
			const planId = session.metadata?.planId;
			const userId = session.metadata?.userId;
			const startedAt = new Date(session.created * 1000);

			const plan = await this.planService.findPlanById(planId as string);

			if (!plan) {
				throw new NotFoundRpcException("Plan not found");
			}

			const planIntervals = {
				[PaymentIntervalsEnum.MONTH]: 30,
				[PaymentIntervalsEnum.WEEK]: 7,
				[PaymentIntervalsEnum.DAY]: 1,
				[PaymentIntervalsEnum.YEAR]: 365,
			};

			const expiresAt = new Date(startedAt);
			expiresAt.setDate(expiresAt.getDate() + planIntervals[plan.interval]);

			await this.subscriptionService.createSubscription({
				planId: planId as string,
				userId: userId as string,
				stripeSubscriptionId: session.subscription as string,
				createdAt: startedAt,
				expiresAt: expiresAt,
			});

			const isUpdated = await this.transactionService.updateTransaction(session.id, {
				status: TransactionStatusEnum.SUCCESS,
				createdAt: startedAt,
				expiresAt: expiresAt,
			});

			if (!isUpdated) {
				throw new UnexpectedErrorRpcException("Transaction not updated");
			}

			// todo отправить юзеру письмо о подписке. пометить юзера в бд как премиум
		}

		if (event.type === "checkout.session.expired") {
			const isUpdated = await this.transactionService.updateTransaction(session.id, {
				status: TransactionStatusEnum.EXPIRED,
			});

			if (!isUpdated) {
				throw new UnexpectedErrorRpcException("Transaction not updated");
			}
		}

		if (event.type === "checkout.session.async_payment_failed") {
			const isUpdated = await this.transactionService.updateTransaction(session.id, {
				status: TransactionStatusEnum.FAILED,
			});
			if (!isUpdated) {
				throw new UnexpectedErrorRpcException("Transaction not updated");
			}
		}
	}

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

		return this.stripeService.webhooks.constructEvent(payload, signature, this.stripeConfig.stripeWebhookSecret);
	}
}

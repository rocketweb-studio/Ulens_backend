import { MeUserViewDto, PaymentInputDto, PaymentInterval, PaymentProvidersEnum, PlanOutputDto } from "@libs/contracts/index";
import { Injectable } from "@nestjs/common";
import { StripeService } from "@payments/core/stripe/stripe.service";
import { PaymentOutputDto } from "@libs/contracts/index";
import { CoreEnvConfig } from "@payments/core/core-env.config";
import Stripe from "stripe";
import { ITransactionCommandRepository } from "./transaction.interface";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { BadRequestRpcException, UnexpectedErrorRpcException } from "@libs/exeption/rpc-exeption";
import { SubscriptionService } from "../subscription/subscription.service";

@Injectable()
export class TransactionService {
	constructor(
		private readonly coreEnvConfig: CoreEnvConfig,
		private readonly stripeService: StripeService,
		private readonly transactionCommandRepository: ITransactionCommandRepository,
		private readonly subscriptionService: SubscriptionService,
	) {}

	async updateTransaction(id: string, data: Partial<UpdateTransactionDto>): Promise<boolean> {
		const isUpdated = await this.transactionCommandRepository.updateTransaction(id, data);
		if (!isUpdated) {
			throw new UnexpectedErrorRpcException("Transaction not updated");
		}
		return isUpdated;
	}

	async makePayment(user: MeUserViewDto, payment: PaymentInputDto, plan: PlanOutputDto): Promise<PaymentOutputDto> {
		if (!plan) {
			throw new Error("Plan not found");
		}

		const subscription = await this.subscriptionService.getSubscriptionByUserId(user.id);

		if (subscription) {
			throw new BadRequestRpcException("Subscription already exists");
		}

		let session: Stripe.Checkout.Session;
		if (payment.provider === PaymentProvidersEnum.STRIPE) {
			session = await this.makeStripePayment(user, plan);
		} else {
			throw new Error("Provider not supported");
		}
		// создаем транзакцию в бд

		await this.transactionCommandRepository.createTransaction(user.id, plan, session.id, payment.provider);

		return { url: session.url as string };
	}

	private async makeStripePayment(user: MeUserViewDto, plan: PlanOutputDto): Promise<Stripe.Checkout.Session> {
		// создаем юзера в stripe для оплаты
		const customer = await this.stripeService.customers.create({ name: user.userName, email: user.email });

		// создаем сессию для оплаты
		const session = await this.stripeService.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: [
				{
					price_data: {
						product_data: {
							name: plan.title,
							description: plan.description ?? "",
						},
						unit_amount: Math.round(plan.price * 100),
						currency: plan.currency,
						recurring: {
							interval: plan.interval as PaymentInterval,
						},
					},
					quantity: 1,
				},
			],
			mode: "subscription",
			// url на который будет перенаправлен пользователь после оплаты
			success_url: `${this.coreEnvConfig.redirectUrl}?success=true`,
			// url на который будет перенаправлен пользователь если он отменит оплату
			cancel_url: `${this.coreEnvConfig.redirectUrl}?success=false`,
			customer: customer.id,
			metadata: {
				userId: user.id,
				planId: plan.id,
			},
		});
		if (!session.url) {
			throw new Error("Payment URL not found");
		}

		return session;
	}
}

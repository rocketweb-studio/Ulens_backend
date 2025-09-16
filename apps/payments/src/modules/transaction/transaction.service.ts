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
import { CreateTransactionDto } from "./dto/create-transaction.dto";

@Injectable()
export class TransactionService {
	constructor(
		private readonly coreEnvConfig: CoreEnvConfig,
		private readonly stripeService: StripeService,
		private readonly transactionCommandRepository: ITransactionCommandRepository,
		private readonly subscriptionService: SubscriptionService,
	) {}

	async createTransaction(dto: CreateTransactionDto): Promise<string> {
		const createdTransaction = await this.transactionCommandRepository.createTransaction(dto);
		return createdTransaction;
	}

	async updateTransaction(id: string, data: Partial<UpdateTransactionDto>): Promise<boolean> {
		const isUpdated = await this.transactionCommandRepository.updateTransaction(id, data);
		if (!isUpdated) {
			throw new UnexpectedErrorRpcException("Transaction not updated");
		}
		return isUpdated;
	}

	async makePayment(user: MeUserViewDto, payment: PaymentInputDto, plan: PlanOutputDto): Promise<PaymentOutputDto> {
		// проверяем отсутствие активной подписки у пользователя
		const subscription = await this.subscriptionService.getSubscriptionByUserId(user.id);

		if (subscription) {
			throw new BadRequestRpcException("Subscription already exists");
		}

		// создаем сессию для оплаты
		let session: any | Stripe.Checkout.Session;
		// для работы с разными провайдерами
		if (payment.provider === PaymentProvidersEnum.STRIPE) {
			session = await this.makeStripePayment(user, plan);
		} else if (payment.provider === PaymentProvidersEnum.PAYPAL) {
			session = await this.makePaypalPayment(user, plan);
		} else {
			throw new Error("Provider not supported");
		}
		// создаем транзакцию в бд
		await this.transactionCommandRepository.createTransaction({
			userId: user.id,
			plan,
			stripeSubscriptionId: null,
			stripeSessionId: session.id,
			provider: payment.provider,
		});

		return { url: session.url as string };
	}

	private async makeStripePayment(user: MeUserViewDto, plan: PlanOutputDto): Promise<Stripe.Checkout.Session> {
		// создаем юзера в stripe для оплаты
		const customer = await this.stripeService.customers.create({ name: user.userName, email: user.email });

		// создаем сессию для оплаты
		const session = await this.stripeService.checkout.sessions.create({
			// типы методов оплаты
			payment_method_types: ["card"],
			// товары для оплаты
			line_items: [
				{
					price_data: {
						// данные о товаре
						product_data: {
							name: plan.title,
							description: plan.description ?? "",
						},
						// данные о цене. умножаем на 100 чтобы получить цену в центах(в страйпе используется наименьшая единица валюты)
						unit_amount: Math.round(plan.price * 100),
						// валюта указана в соответствии с кодами - https://docs.stripe.com/currencies
						currency: plan.currency,
						// данные о периоде(день, неделя, месяц, год) - берем из плана
						recurring: {
							interval: plan.interval as PaymentInterval,
						},
					},
					// количество товаров
					quantity: 1,
				},
			],
			// тип оплаты - подписка
			mode: "subscription",
			// url на который будет перенаправлен пользователь после оплаты
			success_url: `${this.coreEnvConfig.redirectUrl}?success=true`,
			// url на который будет перенаправлен пользователь если он отменит оплату
			cancel_url: `${this.coreEnvConfig.redirectUrl}?success=false`,
			// клиент для оплаты
			customer: customer.id,
			// данные о пользователе и плане в checkout session, придут нам в webhook обратно
			metadata: {
				userId: user.id,
				planId: plan.id,
			},
			// данные о пользователе и плане в subscription, придут нам в webhook обратно
			subscription_data: {
				metadata: {
					userId: user.id,
					planId: plan.id,
				},
			},
		});
		if (!session.url) {
			throw new Error("Payment URL not found");
		}

		return session;
	}

	private async makePaypalPayment(user: MeUserViewDto, plan: PlanOutputDto): Promise<string> {
		return "paypal";
	}
}

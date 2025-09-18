import { Inject, Injectable } from "@nestjs/common";
import Stripe from "stripe";
import { StripeOptionsSymbol } from "./types/stripe.types";
import { StripeOptions } from "./types/stripe.types";
import { MeUserViewDto } from "@libs/contracts/index";
import { StripeConfig } from "./stripe.config";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";
import { PaymentIntervalEnum } from "@libs/contracts/index";

@Injectable()
export class StripeService extends Stripe {
	constructor(
		@Inject(StripeOptionsSymbol) private readonly options: StripeOptions,
		private readonly stripeConfig: StripeConfig,
	) {
		super(options.apiKey, options.config);
	}

	async createSubscriptionCheckoutSession(user: MeUserViewDto, plan: any): Promise<Stripe.Checkout.Session> {
		// создаем юзера в stripe для оплаты
		const customer = await this.customers.create({ name: user.userName, email: user.email });

		// создаем сессию для оплаты
		const session = await this.checkout.sessions.create({
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
							interval: plan.interval as PaymentIntervalEnum,
						},
					},
					// количество товаров
					quantity: 1,
				},
			],
			// тип оплаты - подписка
			mode: "subscription",
			// url на который будет перенаправлен пользователь после оплаты
			success_url: `${this.stripeConfig.redirectUrl}?success=true`,
			// url на который будет перенаправлен пользователь если он отменит оплату
			cancel_url: `${this.stripeConfig.redirectUrl}?success=false`,
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
			throw new NotFoundRpcException("Payment URL not found");
		}

		return session;
	}
}

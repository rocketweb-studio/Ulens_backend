import { Injectable, BadRequestException } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { PayPalConfig } from "./paypal.config";
import { BadRequestRpcException, UnexpectedErrorRpcException } from "@libs/exeption/rpc-exeption";
import { PayPalProductDto } from "./dto/product.dto";
import { PayPalPlanDto } from "./dto/plan.dto";
import { PayPalSubscriptionDto } from "./dto/subscription.dto";

@Injectable()
export class PayPalService {
	private axiosInstance: AxiosInstance;
	private baseUrl: string;
	private accessToken: string;
	private tokenExpiry: Date;

	constructor(private readonly paypalConfig: PayPalConfig) {
		// адрес для запросов к paypal
		this.baseUrl = this.paypalConfig.isSandbox ? "https://api.sandbox.paypal.com" : "https://api.paypal.com";

		// создаем axios instance
		this.axiosInstance = axios.create({
			baseURL: this.baseUrl,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	// Получаем access token для запросов к paypal
	private async getAccessToken(): Promise<string> {
		if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
			return this.accessToken;
		}

		try {
			// создаем base64 auth
			const auth = Buffer.from(`${this.paypalConfig.paypalClientId}:${this.paypalConfig.paypalSecretKey}`).toString("base64");

			// делаем запрос на получение access token
			const response = await this.axiosInstance.post("/v1/oauth2/token", "grant_type=client_credentials", {
				headers: {
					Authorization: `Basic ${auth}`,
					"Content-Type": "application/x-www-form-urlencoded",
				},
			});

			// сохраняем access token и expires_in
			this.accessToken = response.data.access_token;
			const expiresIn = response.data.expires_in;
			this.tokenExpiry = new Date(Date.now() + expiresIn * 1000 - 60000);

			// возвращаем access token
			return this.accessToken;
		} catch (error) {
			throw new BadRequestRpcException(`Failed to authenticate with PayPal: ${error.response?.data?.message || error.message}`);
		}
	}

	// Создаем продукт в paypal
	async createProduct(product: PayPalProductDto): Promise<any> {
		try {
			// получаем access token
			const accessToken = await this.getAccessToken();

			// создаем body для запроса
			const productBody = {
				// название продукта
				name: product.name,
				// описание продукта
				description: product.description,
				// тип продукта - услуга или товар
				type: "SERVICE",
				// категория продукта - программное обеспечение
				category: "SOFTWARE",
				// url на который будет перенаправлен пользователь после оплаты
				home_url: this.paypalConfig.redirectUrl,
			};

			// делаем запрос на создание продукта
			const response = await this.axiosInstance.post("/v1/catalogs/products", productBody, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			// возвращаем данные о продукте
			return response.data;
		} catch (error) {
			throw new UnexpectedErrorRpcException(`Error creating PayPal product: ${error.response?.data?.message || error.message}`);
		}
	}

	// Создаем план в paypal
	async createPlan(plan: PayPalPlanDto): Promise<any> {
		try {
			// получаем access token
			const accessToken = await this.getAccessToken();

			// создаем body для запроса
			const planBody = {
				// название плана
				name: plan.name,
				// описание плана
				description: plan.description,
				// id продукта
				product_id: plan.product_id,
				// статус плана - должно быть "ACTIVE", чтобы план можно было продавать. Иначе его нельзя будет использовать при создании подписки.
				status: "ACTIVE",
				// фазы подписки - PayPal позволяет составлять подписку из нескольких фаз (циклов), например, TRIAL → REGULAR. Здесь — один регулярный цикл.
				billing_cycles: [
					{
						// Периодичность списаний
						frequency: {
							// Единица измерения периодичности(день, неделя, месяц, год)
							interval_unit: plan.interval.toUpperCase(),
							// Количество периодов
							interval_count: 1,
						},
						// тип периода - REGULAR - регулярный период
						tenure_type: "REGULAR",
						// последовательность фаз - 1 - первая фаза, 2 - вторая фаза и т.д.
						sequence: 1,
						// общее количество периодов
						total_cycles: 0,
						pricing_scheme: {
							// схема ценообразования - фиксированная цена
							fixed_price: {
								value: plan.price.toString(),
								currency_code: plan.currency.toUpperCase(),
							},
						},
					},
				],
				payment_preferences: {
					// автоматически списывать долг, если пользователь не оплатил платеж
					auto_bill_outstanding: true,
					// количество попыток оплаты после неудачного платежа
					payment_failure_threshold: 3,
				},
			};

			// делаем запрос на создание плана
			const response = await this.axiosInstance.post("/v1/billing/plans", planBody, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					Prefer: "return=representation",
				},
			});

			return response.data;
		} catch (error) {
			throw new UnexpectedErrorRpcException(`Error creating PayPal plan: ${error.response?.data?.message || error.message}`);
		}
	}

	// Деактивируем план в paypal
	async deactivatePlan(planId: string): Promise<any> {
		try {
			const accessToken = await this.getAccessToken();

			// делаем запрос на деактивацию плана
			const response = await this.axiosInstance.patch(`/v1/billing/plans/${planId}`, [{ op: "replace", path: "/status", value: "INACTIVE" }], {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
			});

			return response.data;
		} catch (error) {
			throw new UnexpectedErrorRpcException(`Error deactivating PayPal plan: ${error.response?.data?.message || error.message}`);
		}
	}

	// Создаем подписку в paypal
	async createPayPalSubscription(subscription: PayPalSubscriptionDto): Promise<any> {
		try {
			const accessToken = await this.getAccessToken();

			// конфигурация нашей подписки
			const subscriptionBody = {
				// id плана в paypal
				plan_id: subscription.paypalPlanId,
				// подписчик и его данные
				subscriber: {
					name: { given_name: subscription.userName, surname: "" },
					email_address: subscription.userEmail,
				},
				// custom_id - аналог metadata в stripe. максимум 127 символов. Передаем id юзера, id плана и id транзакции в базе данных
				custom_id: JSON.stringify({
					userId: subscription.userId,
					planId: subscription.planId,
					transactId: subscription.transactId,
				}),
				// контекст приложения
				application_context: {
					brand_name: "Ulens",
					// Не запрашивать адрес доставки у покупателя
					shipping_preference: "NO_SHIPPING",
					// действие пользователя - указывавется на кнопке при оплате. SUBSCRIBE_NOW - подписаться на подписку
					user_action: "SUBSCRIBE_NOW",
					// url на который будет перенаправлен пользователь после оплаты
					return_url: `${this.paypalConfig.redirectUrl}success`,
					// url на который будет перенаправлен пользователь если он отменит оплату
					cancel_url: `${this.paypalConfig.redirectUrl}failed`,
				},
			};
			const response = await this.axiosInstance.post("/v1/billing/subscriptions", subscriptionBody, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
			});

			return response.data; // содержит approval_url
		} catch (error) {
			throw new BadRequestException(`Failed to create PayPal subscription: ${error.response?.data?.message || error.message}`);
		}
	}

	// Приостанавливаем подписку в paypal
	async suspendSubscription(subscriptionId: string, reason?: string) {
		const accessToken = await this.getAccessToken();
		await this.axiosInstance.post(
			`/v1/billing/subscriptions/${subscriptionId}/suspend`,
			{ reason: reason || "User paused subscription" },
			{ headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } },
		);
	}

	// Активируем подписку в paypal
	async activateSubscription(subscriptionId: string, reason?: string) {
		const accessToken = await this.getAccessToken();
		await this.axiosInstance.post(
			`/v1/billing/subscriptions/${subscriptionId}/activate`,
			{ reason: reason || "User resumed subscription" },
			{ headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } },
		);
	}
}

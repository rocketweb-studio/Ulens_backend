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

	async createProduct(product: PayPalProductDto): Promise<any> {
		try {
			// получаем access token
			const accessToken = await this.getAccessToken();

			// создаем body для запроса
			const productBody = {
				name: product.name,
				description: product.description,
				type: "SERVICE",
				category: "SOFTWARE",
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

	async createPlan(plan: PayPalPlanDto): Promise<any> {
		try {
			// получаем access token
			const accessToken = await this.getAccessToken();

			// создаем body для запроса
			const planBody = {
				name: plan.name,
				description: plan.description,
				product_id: plan.product_id,
				status: "ACTIVE",
				billing_cycles: [
					{
						frequency: {
							interval_unit: plan.interval.toUpperCase(),
							interval_count: 1,
						},
						tenure_type: "REGULAR",
						sequence: 1,
						total_cycles: 0,
						pricing_scheme: {
							fixed_price: {
								value: plan.price.toString(),
								currency_code: plan.currency.toUpperCase(),
							},
						},
					},
				],
				payment_preferences: {
					auto_bill_outstanding: true,
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

	async createPayPalSubscription(subscription: PayPalSubscriptionDto): Promise<any> {
		try {
			const accessToken = await this.getAccessToken();

			const subscriptionBody = {
				plan_id: subscription.paypalPlanId,
				subscriber: {
					name: { given_name: subscription.userName, surname: "" },
					email_address: subscription.userEmail,
				},
				// custom_id - аналог metadata в stripe. максимум 127 символов
				custom_id: JSON.stringify({
					userId: subscription.userId,
					planId: subscription.planId,
					transactId: subscription.transactId,
				}),
				application_context: {
					brand_name: "Ulens",
					shipping_preference: "NO_SHIPPING",
					user_action: "SUBSCRIBE_NOW",
					return_url: `${this.paypalConfig.redirectUrl}?success=true`,
					cancel_url: `${this.paypalConfig.redirectUrl}?success=false`,
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

	// async cancelSubscription(subscriptionId: string): Promise<void> {
	// 	try {
	// 		const accessToken = await this.getAccessToken();

	// 		await this.axiosInstance.post(
	// 			`/v1/billing/subscriptions/${subscriptionId}/cancel`,
	// 			{ reason: 'User requested cancellation' },
	// 			{
	// 				headers: {
	// 					Authorization: `Bearer ${accessToken}`,
	// 					'Content-Type': 'application/json',
	// 				},
	// 			}
	// 		);
	// 	} catch (error) {
	// 		throw new BadRequestRpcException(
	// 			`Failed to cancel PayPal subscription: ${error.response?.data?.message || error.message}`
	// 		);
	// 	}
	// }
	async suspendSubscription(subscriptionId: string, reason?: string) {
		const accessToken = await this.getAccessToken();
		await this.axiosInstance.post(
			`/v1/billing/subscriptions/${subscriptionId}/suspend`,
			{ reason: reason || "User paused subscription" },
			{ headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } },
		);
	}

	async activateSubscription(subscriptionId: string, reason?: string) {
		const accessToken = await this.getAccessToken();
		await this.axiosInstance.post(
			`/v1/billing/subscriptions/${subscriptionId}/activate`,
			{ reason: reason || "User resumed subscription" },
			{ headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } },
		);
	}
}

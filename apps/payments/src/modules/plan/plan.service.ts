import { Injectable } from "@nestjs/common";
import { StripeService } from "@payments/core/stripe/stripe.service";
import { PlanInputDto } from "@libs/contracts/payments-contracts/input/plan.input.dto";
import { IPlanCommandRepository } from "@payments/modules/plan/plan.interface";
import { PayPalService } from "@payments/core/paypal/paypal.service";

@Injectable()
export class PlanService {
	constructor(
		private readonly stripeService: StripeService,
		private readonly paypalService: PayPalService,
		private readonly prismaPlanCommandRepository: IPlanCommandRepository,
	) {}

	async createPlan(plan: PlanInputDto) {
		// create product in paypal
		// @ts-expect-error
		const response = await this.paypalService.client.execute({
			method: "POST",
			url: "/v1/catalogs/products",
			headers: {
				"Content-Type": "application/json",
			},
			body: {
				name: "Test Product",
				description: "Test Description",
				type: "SERVICE",
				category: "SOFTWARE",
				image_url: "https://example.com/image.png",
				home_url: "https://example.com",
			},
		});

		console.log(response);

		// создаем план в stripe
		// const stripePlan = await this.stripeService.plans.create({
		// 	amount: Math.round(plan.price * 100),
		// 	currency: plan.currency,
		// 	interval: plan.interval,
		// 	product: {
		// 		name: plan.title,
		// 	},
		// });

		// создаем план в локальной бд
		// const createdPlan = await this.prismaPlanCommandRepository.createPlan(plan, stripePlan.id, stripePlan.product?.toString() || "");

		return null;
	}

	async deletePlan(id: string) {
		// получаем план из локальной бд
		const plan = await this.prismaPlanCommandRepository.findPlanById(id);
		if (!plan) {
			throw new Error("Plan not found");
		}
		// удаляем план в stripe
		await this.stripeService.plans.del(plan.stripePlanId);
		// удаляем продукт в stripe
		await this.stripeService.products.del(plan.stripeProductId);

		// удаляем план из локальной бд
		const isDeleted = await this.prismaPlanCommandRepository.deletePlan(id);
		if (!isDeleted) {
			throw new Error("Plan not deleted");
		}
		return isDeleted;
	}

	async findPlanById(id: string): Promise<any> {
		const plan = await this.prismaPlanCommandRepository.findPlanById(id);
		if (!plan) {
			throw new Error("Plan not found");
		}
		return plan;
	}

	async createPayPalProduct(options: { clientId: string; clientSecret: string; sandbox?: boolean; name: string; description?: string }) {
		const baseUrl = options.sandbox ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";

		// 1. Получаем access token
		const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
			method: "POST",
			headers: {
				Authorization: `Basic ${Buffer.from(`${options.clientId}:${options.clientSecret}`).toString("base64")}`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: "grant_type=client_credentials",
		});

		if (!tokenRes.ok) {
			throw new Error(`Failed to get access token: ${tokenRes.statusText}`);
		}

		const tokenData = await tokenRes.json();
		const accessToken = tokenData.access_token;

		// 2. Создаём продукт
		const productRes = await fetch(`${baseUrl}/v1/catalogs/products`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: options.name,
				description: options.description || "",
				type: "SERVICE", // SaaS или сервис
				category: "SOFTWARE", // категория для продукта
			}),
		});

		if (!productRes.ok) {
			const err = await productRes.text();
			throw new Error(`Failed to create product: ${err}`);
		}

		const product = await productRes.json();
		return product;
	}
}

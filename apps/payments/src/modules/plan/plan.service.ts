import { Injectable } from "@nestjs/common";
import { StripeService } from "@payments/core/stripe/stripe.service";
import { PlanInputDto } from "@libs/contracts/payments-contracts/input/plan.input.dto";
import { IPlanCommandRepository } from "@payments/modules/plan/plan.interface";
import { PayPalService } from "@payments/core/paypal/paypal.service";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";

@Injectable()
export class PlanService {
	constructor(
		private readonly stripeService: StripeService,
		private readonly paypalService: PayPalService,
		private readonly prismaPlanCommandRepository: IPlanCommandRepository,
	) {}

	async createPlan(plan: PlanInputDto): Promise<number> {
		// создаем продукт в paypal
		const paypalProduct = await this.paypalService.createProduct({
			name: plan.title,
			description: plan.description,
		});

		// создаем план в paypal
		const paypalPlan = await this.paypalService.createPlan({
			product_id: paypalProduct.id,
			name: plan.title,
			description: plan.description,
			interval: plan.interval,
			price: plan.price,
			currency: plan.currency,
		});

		// создаем план в stripe
		const stripePlan = await this.stripeService.plans.create({
			amount: Math.round(plan.price * 100),
			currency: plan.currency,
			interval: plan.interval,
			product: {
				name: plan.title,
			},
		});

		// создаем план в локальной бд
		const createdPlan = await this.prismaPlanCommandRepository.createPlan({
			plan: plan,
			stripePlanId: stripePlan.id,
			stripeProductId: stripePlan.product?.toString() || "",
			paypalPlanId: paypalPlan.id,
			paypalProductId: paypalProduct.id,
		});

		// return createdPlan;
		return createdPlan;
	}

	async deletePlan(id: string) {
		// получаем план из локальной бд
		const plan = await this.prismaPlanCommandRepository.findPlanById(+id);
		if (!plan) {
			throw new NotFoundRpcException(`Plan with id ${id} not found`);
		}
		// удаляем план в stripe
		await this.stripeService.plans.del(plan.stripePlanId);
		// удаляем продукт в stripe
		await this.stripeService.products.del(plan.stripeProductId);

		// Удалить продукт в paypal нельзя, поэтому деактивируем план
		await this.paypalService.deactivatePlan(plan.paypalPlanId);

		// удаляем план из локальной бд
		const isDeleted = await this.prismaPlanCommandRepository.deletePlan(+id);
		if (!isDeleted) {
			throw new Error("Plan not deleted");
		}
		return isDeleted;
	}

	async findPlanById(id: number): Promise<any> {
		const plan = await this.prismaPlanCommandRepository.findPlanById(id);
		if (!plan) {
			throw new NotFoundRpcException(`Plan with id ${id} not found`);
		}
		return plan;
	}
}

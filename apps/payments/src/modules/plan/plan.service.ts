import { Injectable } from "@nestjs/common";
import { StripeService } from "@payments/core/stripe/stripe.service";
import { PlanInputDto } from "@libs/contracts/payments-contracts/input/plan.input.dto";
import { IPlanCommandRepository } from "@payments/modules/plan/plan.interface";

@Injectable()
export class PlanService {
	constructor(
		private readonly stripeService: StripeService,
		private readonly prismaPlanCommandRepository: IPlanCommandRepository,
	) {}

	async createPlan(plan: PlanInputDto) {
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
		const createdPlan = await this.prismaPlanCommandRepository.createPlan(plan, stripePlan.id, stripePlan.product?.toString() || "");

		return createdPlan;
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
}

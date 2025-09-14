import { Injectable } from "@nestjs/common";
import { IPlanCommandRepository } from "@payments/modules/plan/plan.interface";
import { PrismaService } from "@payments/core/prisma/prisma.service";
import { PlanInputDto } from "@libs/contracts/index";

@Injectable()
export class PrismaPlanCommandRepository implements IPlanCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createPlan(plan: PlanInputDto, stripePlanId: string, stripeProductId: string): Promise<string> {
		const createdPlan = await this.prisma.plan.create({
			data: {
				title: plan.title,
				description: plan.description,
				price: plan.price,
				currency: plan.currency,
				interval: plan.interval,
				stripeProductId: stripeProductId,
				stripePlanId: stripePlanId,
			},
		});
		return createdPlan.id;
	}

	async deletePlan(id: string): Promise<boolean> {
		const deletedPlan = await this.prisma.plan.delete({ where: { id } });
		return !!deletedPlan;
	}

	async findPlanById(id: string): Promise<any | null> {
		const plan = await this.prisma.plan.findUnique({ where: { id } });
		return plan;
	}
}

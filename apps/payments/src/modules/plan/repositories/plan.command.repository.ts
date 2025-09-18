import { Injectable } from "@nestjs/common";
import { IPlanCommandRepository } from "@payments/modules/plan/plan.interface";
import { PrismaService } from "@payments/core/prisma/prisma.service";
import { PlanDto } from "../dto/plan.dto";

@Injectable()
export class PrismaPlanCommandRepository implements IPlanCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createPlan(planDto: PlanDto): Promise<number> {
		const createdPlan = await this.prisma.plan.create({
			data: {
				title: planDto.plan.title,
				description: planDto.plan.description,
				price: planDto.plan.price,
				currency: planDto.plan.currency,
				interval: planDto.plan.interval,
				stripeProductId: planDto.stripeProductId,
				stripePlanId: planDto.stripePlanId,
				paypalPlanId: planDto.paypalPlanId,
				paypalProductId: planDto.paypalProductId,
			},
		});
		return createdPlan.id;
	}

	async deletePlan(id: number): Promise<boolean> {
		// возможно нужно сделать soft-delete но в страйпе план удаляется полностью
		const deletedPlan = await this.prisma.plan.delete({ where: { id } });
		return !!deletedPlan;
	}

	async findPlanById(id: number): Promise<any | null> {
		const plan = await this.prisma.plan.findUnique({ where: { id } });
		return plan;
	}
}

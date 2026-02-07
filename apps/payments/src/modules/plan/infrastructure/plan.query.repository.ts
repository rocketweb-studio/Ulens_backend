import { Injectable } from "@nestjs/common";
import { IPlanQueryRepository } from "@payments/modules/plan/plan.interface";
import { PrismaService } from "@payments/core/prisma/prisma.service";
import { PlanOutputDto } from "@libs/contracts/index";
import { Plan } from "@payments/core/prisma/generated/client";

@Injectable()
export class PrismaPlanQueryRepository implements IPlanQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getPlans(): Promise<PlanOutputDto[]> {
		const plans = await this.prisma.plan.findMany({
			select: {
				id: true,
				title: true,
				description: true,
				price: true,
				currency: true,
				interval: true,
			},
		});
		return plans as PlanOutputDto[];
	}

	async findPlanById(id: number): Promise<PlanOutputDto | null> {
		const plan = await this.prisma.plan.findUnique({
			where: { id },
			select: {
				id: true,
				title: true,
				description: true,
				price: true,
				currency: true,
				interval: true,
			},
		});
		if (!plan) return null;
		return plan as PlanOutputDto;
	}

	async findRawPlanById(id: number): Promise<Plan | null> {
		const plan = await this.prisma.plan.findUnique({ where: { id } });
		return plan;
	}
}

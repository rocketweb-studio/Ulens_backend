import { Injectable } from "@nestjs/common";
import { IPlanQueryRepository } from "@payments/modules/plan/plan.interface";
import { PrismaService } from "@payments/core/prisma/prisma.service";
import { Plan } from "@payments/core/prisma/generated/client";
import { CurrencyEnum, PaymentIntervalEnum, PlanOutputDto } from "@libs/contracts/index";

@Injectable()
export class PrismaPlanQueryRepository implements IPlanQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getPlans(): Promise<PlanOutputDto[]> {
		const plans = await this.prisma.plan.findMany();
		return plans.map((plan) => this._mapToView(plan));
	}

	async findPlanById(id: string): Promise<PlanOutputDto | null> {
		const plan = await this.prisma.plan.findUnique({ where: { id } });
		return plan ? this._mapToView(plan) : null;
	}

	private _mapToView(plan: Plan): PlanOutputDto {
		return {
			id: plan.id,
			title: plan.title,
			description: plan.description,
			price: plan.price,
			currency: plan.currency as CurrencyEnum,
			interval: plan.interval as PaymentIntervalEnum,
		};
	}
}

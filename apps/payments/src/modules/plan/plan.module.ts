import { Module } from "@nestjs/common";
import { PlanController } from "@payments/modules/plan/plan.controller";
import { PlanService } from "@payments/modules/plan/plan.service";
import { PrismaPlanCommandRepository } from "@payments/modules/plan/repositories/plan.command.repository";
import { IPlanCommandRepository, IPlanQueryRepository } from "@payments/modules/plan/plan.interface";
import { PrismaPlanQueryRepository } from "@payments/modules/plan/repositories/plan.query.repository";

@Module({
	imports: [],
	controllers: [PlanController],
	providers: [
		PlanService,
		{ provide: IPlanCommandRepository, useClass: PrismaPlanCommandRepository },
		{ provide: IPlanQueryRepository, useClass: PrismaPlanQueryRepository },
	],
	exports: [PlanService],
})
export class PlanModule {}

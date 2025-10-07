import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PlanService } from "@payments/modules/plan/plan.service";
import { PaymentsMessages } from "@libs/constants/payment-messages";
import { PlanInputDto } from "@libs/contracts/payments-contracts/input/plan.input.dto";
import { IPlanQueryRepository } from "@payments/modules/plan/plan.interface";
import { PlanOutputDto } from "@libs/contracts/index";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";

@Controller()
export class PlanController {
	constructor(
		private readonly planService: PlanService,
		private readonly planQueryRepository: IPlanQueryRepository,
	) {}

	@MessagePattern({ cmd: PaymentsMessages.GET_PLANS })
	async getPlans(): Promise<PlanOutputDto[]> {
		return this.planQueryRepository.getPlans();
	}

	@MessagePattern({ cmd: PaymentsMessages.CREATE_PLAN })
	async createPlan(@Payload() dto: { plan: PlanInputDto }): Promise<PlanOutputDto> {
		const planId = await this.planService.createPlan(dto.plan);
		const plan = await this.planQueryRepository.findPlanById(planId);
		if (!plan) {
			throw new NotFoundRpcException(`Plan with id ${planId} not found`);
		}
		return plan;
	}

	@MessagePattern({ cmd: PaymentsMessages.DELETE_PLAN })
	async deletePlan(@Payload() dto: { id: string }): Promise<boolean> {
		return this.planService.deletePlan(dto.id);
	}
}

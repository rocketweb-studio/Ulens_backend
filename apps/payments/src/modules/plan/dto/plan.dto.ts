import { PlanInputDto } from "@libs/contracts/payments-contracts/input/plan.input.dto";

export class PlanDto {
	plan: PlanInputDto;
	stripePlanId: string;
	stripeProductId: string;
	paypalPlanId: string;
	paypalProductId: string;
}

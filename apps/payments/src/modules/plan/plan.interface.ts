/**
 *Using abstract classes lets Nest use the class itself as the DI token,
 *   so your service can inject by type without @Inject()
 */

import { PlanInputDto, PlanOutputDto } from "@libs/contracts/index";

export abstract class IPlanQueryRepository {
	abstract getPlans(): Promise<PlanOutputDto[]>;
	abstract findPlanById(id: string): Promise<PlanOutputDto | null>;
}

export abstract class IPlanCommandRepository {
	abstract createPlan(plan: PlanInputDto, stripePlanId: string, stripeProductId: string): Promise<string>;
	abstract deletePlan(id: string): Promise<boolean>;
	abstract findPlanById(id: string): Promise<any | null>;
}

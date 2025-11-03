/**
 *Using abstract classes lets Nest use the class itself as the DI token,
 *   so your service can inject by type without @Inject()
 */

import { PlanOutputDto } from "@libs/contracts/index";
import { PlanDto } from "@payments/modules/plan/dto/plan.dto";

export abstract class IPlanQueryRepository {
	abstract getPlans(): Promise<PlanOutputDto[]>;
	abstract findPlanById(id: number): Promise<PlanOutputDto | null>;
	abstract findRawPlanById(id: number): Promise<any | null>;
}

export abstract class IPlanCommandRepository {
	abstract createPlan(plan: PlanDto): Promise<number>;
	abstract deletePlan(id: number): Promise<boolean>;
	abstract findPlanById(id: number): Promise<any | null>;
}

import { PaymentProvidersEnum, PlanOutputDto } from "@libs/contracts/index";

export class CreateTransactionDto {
	userId: string;
	plan: PlanOutputDto;
	stripeSubscriptionId: string | null;
	stripeSessionId: string | null;
	provider: PaymentProvidersEnum;
}

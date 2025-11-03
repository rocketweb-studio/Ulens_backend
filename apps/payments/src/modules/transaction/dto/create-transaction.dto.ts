import { PaymentProvidersEnum, PlanOutputDto, TransactionStatusEnum } from "@libs/contracts/index";

export class CreateTransactionDto {
	userId: string;
	plan: PlanOutputDto;
	stripeSubscriptionId: string | null;
	stripeSessionId: string | null;
	paypalSessionId: string | null;
	paypalPlanId: string | null;
	provider: PaymentProvidersEnum;
	status?: TransactionStatusEnum;
	createdAt?: Date;
	expiresAt?: Date;
}

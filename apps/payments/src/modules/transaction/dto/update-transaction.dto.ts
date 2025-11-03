import { TransactionStatusEnum } from "@libs/contracts/index";

export class UpdateTransactionDto {
	status: TransactionStatusEnum;
	createdAt?: Date;
	expiresAt?: Date;
	stripeSubscriptionId?: string;
	paypalPlanId?: string;
	paypalSessionId?: string;
	stripeSessionId?: string;
}

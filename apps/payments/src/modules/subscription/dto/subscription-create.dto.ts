export class SubscriptionCreateDto {
	planId: string;
	userId: string;
	createdAt: Date;
	expiresAt: Date;
	stripeSubscriptionId: string;
}

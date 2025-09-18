export class SubscriptionCreateDto {
	planId: number;
	userId: string;
	createdAt: Date;
	expiresAt: Date;
	stripeSubscriptionId: string | null;
	paypalSubscriptionId: string | null;
}

export type PremiumActivatedInput = {
	messageId: string;
	transactionId: string;
	userId: string;
	planCode: string;
	premiumUntil?: string;
	correlationId?: string;
};

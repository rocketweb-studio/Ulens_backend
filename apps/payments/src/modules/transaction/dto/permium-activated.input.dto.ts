export type PremiumActivatedInput = {
	messageId: string;
	sessionId: string;
	userId: string;
	planId: string;
	premiumExpDate: string;
	occurredAt?: string;
};

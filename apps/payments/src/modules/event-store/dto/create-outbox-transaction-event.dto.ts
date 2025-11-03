export interface CreateOutBoxTransactionEventDto {
	sessionId: string;
	userId: string;
	planId: number;
	provider: "MOCK" | "STRIPE" | "PAYPAL";
	eventType: "payment.succeeded" | "payment.failed";
	expiresAt: Date;
}

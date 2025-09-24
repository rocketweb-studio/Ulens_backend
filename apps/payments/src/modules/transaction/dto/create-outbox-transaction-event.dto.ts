export interface CreateOutBoxTransactionEventDto {
	sessionId: string;
	userId: string;
	planId: number;
	provider: "MOCK" | "STRIPE" | "PAYPAL";
	expiresAt: Date;
}

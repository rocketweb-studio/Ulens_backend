export interface CreateTransactionInternalDto {
	id: string;
	userId: string;
	amountCents: number;
	currency: string;
	provider: "MOCK" | "STRIPE" | "PAYPAL";
	status: "PENDING";
	idempotencyKey: string;
	correlationId: string;
	metadata: { planCode: string };
}

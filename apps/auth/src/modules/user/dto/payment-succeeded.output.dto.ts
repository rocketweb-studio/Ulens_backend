export type PaymentSucceededInput = {
	messageId: string; // из события
	userId: string; // из события
	planCode: string; // "PREMIUM_MONTH" | "PREMIUM_YEAR" и т.п.
	occurredAt?: string; // ISO-строка (опционально)
	transactionId: string; // из события payments
	correlationId: string;
};

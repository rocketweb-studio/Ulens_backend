export type PaymentSucceededInput = {
	messageId: string; // из события
	userId: string; // из события
	sessionId: string;
	planId: number;
	provider: string;
	expiresAt: string;
	occurredAt?: string; // ISO-строка (опционально)
};

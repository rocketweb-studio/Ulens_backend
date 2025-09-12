export interface EventEnvelope<T = unknown> {
	messageId: string; // уникальный ID сообщения (для идемпотентности)
	traceId: string; // кореляция между сервисами (для логов/трейсинга)
	type: string; // имя события с версией, напр. "auth.user.registered.v1"
	occurredAt: string; // ISO дата-время генерации события
	producer: string; // кто сгенерировал (например, "gateway" или "auth")
	payload: T; // полезные данные
}

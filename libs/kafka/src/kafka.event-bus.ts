import { Inject, Injectable } from "@nestjs/common";
import type { Producer, IHeaders } from "kafkajs";

// Используем общий интерфейс шины событий — бизнес-код не меняется при смене транспорта.
// Интерфейс точно такой же как мы используем для Rabbit. Импорты не работают поэтому дублируем здесь.
export interface EventBus {
	publish(
		exchangeOrTopic: string, // Rabbit: exchange, Kafka: topic
		routingKeyOrPartitionKey: string, // Rabbit: routingKey, Kafka: partition-key (можно userId)
		message: unknown,
		options?: { headers?: Record<string, any> },
	): Promise<void>;

	// этот метод гарантирует доставку сообщения в отличие от первого метода publish
	publishConfirm(
		exchangeOrTopic: string,
		routingKeyOrPartitionKey: string,
		message: unknown,
		options?: { headers?: Record<string, any>; mandatory?: boolean; timeoutMs?: number },
	): Promise<void>;
}

/**
 * Kafka headers допускают только примитивы/Buffer/null.
 * Всё остальное преобразуем в Buffer(JSON).
 * Заголовки — это метаданные сообщения (не бизнес-данные). Их удобно читать, не парся payload.
 * В Rabbit мы часто используем exchange + routingKey для маршрутизации. В Kafka нет routingKey, есть только topic и key.
 * Поэтому:
 *  либо мы делаем много топиков (по типам событий),
 *  либо один общий топик и кладём тип/маршрут в заголовок (у нас rk) — чтобы быстро фильтровать и роутить,
 * 		не залазя в payload.
 */
function toKafkaHeaders(h?: Record<string, any>): IHeaders | undefined {
	if (!h) return undefined;
	const out: IHeaders = {};
	for (const [k, v] of Object.entries(h)) {
		if (typeof v === "string" || typeof v === "number" || typeof v === "boolean" || v === null) {
			out[k] = v as any;
		} else {
			out[k] = Buffer.from(JSON.stringify(v));
		}
	}
	return out;
}

/**
 * Адаптер под Kafka, совместимый с EventBus:
 * - exchangeOrTopic - topic
 * - routingKeyOrPartitionKey - key (управляет партиционированием/порядком)
 * - publishConfirm ждёт подтверждение брокера (acks=-1) + опциональный timeout
 *
 * Идемпотентность/повторы по-старому решаются через Outbox/Inbox, как и в Rabbit.
 */
@Injectable()
export class KafkaEventBus implements EventBus {
	constructor(@Inject("KAFKA_PRODUCER") private readonly producer: Producer) {}

	/**
	 * Обычная публикация:
	 * - topic = exchangeOrTopic
	 * - key   = routingKeyOrPartitionKey (например, userId → порядок по пользователю)
	 * - acks: -1 → ждём репликации всеми ISR (аналог confirm в Rabbit)
	 */
	async publish(topic: string, key: string, message: unknown, options?: { headers?: Record<string, any> }): Promise<void> {
		await this.producer.send({
			topic,
			acks: -1, // ждать подтверждения всех реплик  'all' — безопасная доставка
			messages: [
				{
					key,
					value: Buffer.from(JSON.stringify(message)),
					headers: toKafkaHeaders(options?.headers),
				},
			],
		});
	}

	/**
	 * Публикация с подтверждением и таймаутом:
	 * - если брокер не подтвердит за timeout - выбрасываем ошибку,
	 *   Outbox пометит событие FAILED и назначит retry (backoff).
	 */
	async publishConfirm(
		topic: string,
		key: string,
		message: unknown,
		options?: { headers?: Record<string, any>; mandatory?: boolean; timeoutMs?: number },
	): Promise<void> {
		await this.producer.send({
			topic,
			acks: -1,
			timeout: options?.timeoutMs ?? 10_000,
			messages: [
				{
					key,
					value: Buffer.from(JSON.stringify(message)),
					headers: toKafkaHeaders(options?.headers),
				},
			],
		});
		// Если send() выбросит — Outbox пометит FAILED и назначит retry.
		// Параметр mandatory у Kafka отсутствует — тут он игнорируется.
	}
}

import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { EventEnvelope } from "@libs/contracts/index";
import { EventBus } from "@libs/kafka/index"; // интерфейс общий, реализация подставляется DI

@Injectable()
export class AuthKafkaPublisher {
	constructor(@Inject("EVENT_BUS") private readonly bus: EventBus) {}

	/**
	 * Подтверждение активации премиума (AUTH - другие сервисы)
	 * Публикуем в общий топик/эксчендж. Для Kafka второй аргумент — partition key (берём userId),
	 * для Rabbit это будет routingKey (реализация адаптирует).
	 */
	async publishUserPremiumActivatedKafkaEvent(payload: {
		transactionId: string;
		userId: string;
		planCode: string;
		premiumUntil: string; // ISO
		correlationId: string;
	}) {
		console.log("[AUTH][Publisher][PREMIUM_ACTIVATED][IN]", payload);

		const topic = process.env.KAFKA_EVENTS_TOPIC ?? "app.events.v1";

		const evt = {
			messageId: randomUUID(),
			traceId: payload.correlationId,
			type: "auth.user.premium.activated.v1",
			occurredAt: new Date().toISOString(),
			producer: "auth",
			payload,
		};

		console.log("[AUTH][Publisher][PREMIUM_ACTIVATED][SEND_ATTEMPT]", {
			topic,
			key: payload.userId,
			messageId: evt.messageId,
			traceId: evt.traceId,
		});

		await this.bus.publishConfirm(topic, payload.userId, evt, {
			headers: {
				"content-type": "application/json",
				rk: "auth.user.premium.activated.v1", // удобно фильтровать на консьюмерах
			},
		});

		console.log("[AUTH][Publisher][PREMIUM_ACTIVATED][SENT_OK]", {
			messageId: evt.messageId,
			userId: payload.userId,
			transactionId: payload.transactionId,
		});
	}

	// === Старые тестовые методы ===
	async publishUserRegisteredKafkaEvent(payload: { userId: string; email: string }) {
		const topic = process.env.KAFKA_EVENTS_TOPIC ?? "app.events.v1";
		const evt: EventEnvelope<typeof payload> = {
			messageId: randomUUID(),
			traceId: randomUUID(),
			type: "auth.user.registered.v1",
			occurredAt: new Date().toISOString(),
			producer: "auth",
			payload,
		};

		await this.bus.publish(topic, payload.userId, evt, {
			headers: {
				"content-type": "application/json",
				rk: "auth.user.premium.activated.v1", // удобно фильтровать на консьюмерах
			},
		});
	}
}

import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { EventEnvelope } from "@libs/contracts/index";
import { EventBus } from "@libs/rabbit/rabbit.event-bus"; //  интерфейс из либы

@Injectable()
export class RabbitEventsPublisher {
	constructor(@Inject("EVENT_BUS") private readonly bus: EventBus) {}

	async publishUserPremiumActivated(payload: {
		sessionId: string;
		userId: string;
		planId: number;
		premiumExpDate: string; // ISO
	}) {
		const evt = {
			messageId: randomUUID(),
			type: "auth.user.premium.activated.v1",
			occurredAt: new Date().toISOString(),
			producer: "auth",
			payload,
		};

		await this.bus.publishConfirm("app.events", "auth.user.premium.activated.v1", evt, { headers: { "x-service": "auth" }, mandatory: true, timeoutMs: 10000 });
		console.log("[AUTH][RMQ] published auth.user.premium.activated.v1:", evt);
	}

	// Тестовый метод. Отправляем событие: пользователь зарегистрирован
	async publishRabbitUserRegistered(payload: { userId: string; email: string }) {
		const evt: EventEnvelope<typeof payload> = {
			messageId: randomUUID(),
			traceId: randomUUID(),
			type: "auth.user.registered.v1",
			occurredAt: new Date().toISOString(),
			producer: "auth",
			payload,
		};

		await this.bus.publishConfirm("app.events", "auth.user.registered.v1", evt, { headers: { "x-service": "auth" }, mandatory: true, timeoutMs: 10000 });
		console.log("[AUTH][RMQ] published auth.user.registered.v1:", evt);
	}
}

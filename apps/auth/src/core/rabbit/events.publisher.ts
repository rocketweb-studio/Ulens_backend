import { Inject, Injectable } from "@nestjs/common";
import * as amqp from "amqplib";
import { randomUUID } from "crypto";
import { EventEnvelope } from "@libs/contracts/index";

@Injectable()
export class AuthEventsPublisher {
	constructor(@Inject("RMQ_CHANNEL") private readonly ch: amqp.Channel) {}

	// Отправляем событие: пользователь зарегистрирован
	async publishRabbitUserRegistered(payload: { userId: string; email: string }) {
		const evt: EventEnvelope<typeof payload> = {
			messageId: randomUUID(),
			traceId: randomUUID(),
			type: "auth.user.registered.v1",
			occurredAt: new Date().toISOString(),
			producer: "auth", // теперь производитель — сам auth
			payload,
		};

		this.ch.publish(
			"app.events", // общий topic exchange
			"auth.user.registered.v1", // routing key = тип события
			Buffer.from(JSON.stringify(evt)),
			{ persistent: true, contentType: "application/json" },
		);
		console.log("[AUTH][RMQ] published auth.user.registered.v1:", evt);
	}
}

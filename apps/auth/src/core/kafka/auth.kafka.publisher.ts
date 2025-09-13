import { Inject, Injectable } from "@nestjs/common";
import type { Producer } from "kafkajs";
import { randomUUID } from "crypto";
import { EventEnvelope } from "@libs/contracts/index";

@Injectable()
export class AuthKafkaPublisher {
	constructor(@Inject("KAFKA_PRODUCER") private readonly producer: Producer) {}

	async publishUserRegisteredKafkaEvent(payload: { userId: string; email: string }) {
		const evt: EventEnvelope<typeof payload> = {
			messageId: randomUUID(),
			traceId: randomUUID(),
			type: "auth.user.registered.v1",
			occurredAt: new Date().toISOString(),
			producer: "auth",
			payload,
		};

		await this.producer.send({
			topic: "app.events.v1",
			messages: [
				{
					key: payload.userId, // порядок по пользователю
					value: Buffer.from(JSON.stringify(evt)),
					headers: {
						"content-type": "application/json",
						rk: "auth.user.registered.v1", // «routing key» в header (для удобства фильтра)
					},
				},
			],
		});
	}
}

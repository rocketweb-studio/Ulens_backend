import { Inject, Injectable } from "@nestjs/common";
import * as amqp from "amqplib";

export interface EventBus {
	publish(
		exchangeOrTopic: string, // Rabbit: exchange, Kafka: topic
		routingKeyOrPartitionKey: string, // Rabbit: routingKey, Kafka: partition-key (можно userId)
		message: unknown,
		options?: { headers?: Record<string, any> },
	): Promise<void>;
}

@Injectable()
export class RabbitEventBus implements EventBus {
	constructor(@Inject("RMQ_CHANNEL") private readonly ch: amqp.Channel) {}

	async publish(exchange: string, routingKey: string, message: unknown, options?: { headers?: Record<string, any> }): Promise<void> {
		// На всякий случай убеждаемся, что exchange существует (topic, durable)
		await this.ch.assertExchange(exchange, "topic", { durable: true });

		const ok = this.ch.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), {
			persistent: true,
			contentType: "application/json",
			headers: options?.headers,
		});

		// Если внутренний буфер переполнен — ждем drain (редко нужно, но безопаснее)
		if (!ok) {
			await new Promise<void>((resolve) => this.ch.once("drain", () => resolve()));
		}
	}
}

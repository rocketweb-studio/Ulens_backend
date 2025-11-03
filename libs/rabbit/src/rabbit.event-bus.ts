import { Inject, Injectable } from "@nestjs/common";
import * as amqp from "amqplib";
import { randomUUID } from "crypto";

export interface EventBus {
	/*  первый метод который использовали изначально. Он отправляет сообщение но гарантия доставки сообщения ложится
	 на Rabbit. Если сообщение было утеряно где-то по дороге томожет возникнуть ситуация, когда outboxEvents подвиснет
	 сообщение со статусом PUBLISHED и на этом цепочка оборвется. Поэтому написали второй метод publishConfirm,
	 который гарантирует доставку сообщения иначе вернет ошибку */
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

	// Публикация с подтверждением брокера + обработка unroutable
	async publishConfirm(
		exchange: string,
		routingKey: string,
		message: unknown,
		options?: { headers?: Record<string, any>; mandatory?: boolean; timeoutMs?: number },
	): Promise<void> {
		const ch = this.ch as unknown as amqp.ConfirmChannel; // confirm-канал обязателен
		await ch.assertExchange(exchange, "topic", { durable: true });
		const payload = Buffer.from(JSON.stringify(message));

		const pubId = randomUUID(); // корреляция для 'return'
		const headers = { ...(options?.headers || {}), "x-pub-id": pubId };
		const mandatory = options?.mandatory ?? true; // хотим получать 'return' при нераутировании
		const timeoutMs = options?.timeoutMs ?? 5000;

		let returned = false;
		const onReturn = (msg: amqp.Message) => {
			try {
				if (msg?.properties?.headers?.["x-pub-id"] === pubId) {
					returned = true;
				}
			} catch {
				/* ignore */
			}
		};

		// слушаем ровно один возврат, привязанный к x-pub-id
		ch.on("return", onReturn);

		await new Promise<void>((resolve, reject) => {
			const timer = setTimeout(() => {
				ch.off("return", onReturn);
				reject(new Error("Publish confirm timeout"));
			}, timeoutMs);

			const ok = ch.publish(exchange, routingKey, payload, { persistent: true, contentType: "application/json", headers, mandatory }, (err) => {
				clearTimeout(timer);
				ch.off("return", onReturn);
				if (err) return reject(err);
				if (returned) return reject(new Error(`Message was returned (unroutable): ${exchange}:${routingKey}`));
				return resolve();
			});

			if (!ok) ch.once("drain", () => void 0);
		});
	}
}

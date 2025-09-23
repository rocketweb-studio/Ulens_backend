import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import * as amqp from "amqplib";
import { ITransactionCommandRepository } from "../../modules/transaction/transaction.interface";

@Injectable()
export class RabbitPaymentsConsumer implements OnModuleInit {
	constructor(
		@Inject("RMQ_CHANNEL") private readonly ch: amqp.Channel,
		private readonly repo: ITransactionCommandRepository,
	) {}

	async onModuleInit() {
		// очередь + бинды
		await this.ch.assertQueue("payments.auth.premium.activated.q", {
			durable: true,
			arguments: {
				"x-dead-letter-exchange": "app.dlx",
				"x-dead-letter-routing-key": "payments.auth.premium.activated.q.dlq",
			},
		});
		await this.ch.bindQueue("payments.auth.premium.activated.q", "app.events", "auth.user.premium.activated.v1");

		await this.ch.assertQueue("payments.auth.premium.activated.q.retry.1m", {
			durable: true,
			arguments: {
				"x-message-ttl": 60_000,
				"x-dead-letter-exchange": "app.events",
				"x-dead-letter-routing-key": "auth.user.premium.activated.v1",
			},
		});

		await this.ch.assertQueue("payments.auth.premium.activated.q.dlq", { durable: true });
		await this.ch.bindQueue("payments.auth.premium.activated.q.dlq", "app.dlx", "payments.auth.premium.activated.q.dlq");

		await this.ch.consume(
			"payments.auth.premium.activated.q",
			async (msg) => {
				if (!msg) return;
				try {
					// получаем сообщение из auth: { messageId, traceId, type, occurredAt, producer, payload: {...} }
					const env = JSON.parse(msg.content.toString());
					const p = env.payload as {
						sessionId: string;
						userId: string;
						planId: string;
						premiumExpDate: string;
					};

					// завершаем транзакцию
					await this.repo.finalizeAfterPremiumActivated({
						messageId: env.messageId,
						sessionId: p.sessionId,
						userId: p.userId,
						planId: p.planId,
						premiumExpDate: p.premiumExpDate,
					});

					this.ch.ack(msg);
				} catch (_e) {
					// простые ретраи → DLQ
					const retries = Number(msg.properties.headers?.["x-retries"] ?? 0);
					if (retries < 3) {
						this.ch.sendToQueue("payments.auth.premium.activated.q.retry.1m", msg.content, {
							persistent: true,
							contentType: "application/json",
							headers: { ...(msg.properties.headers || {}), "x-retries": retries + 1 },
						});
						this.ch.ack(msg);
					} else {
						this.ch.publish("app.dlx", "payments.auth.premium.activated.q.dlq", msg.content, {
							persistent: true,
							contentType: "application/json",
							headers: msg.properties.headers,
						});
						this.ch.ack(msg);
					}
				}
			},
			{ noAck: false },
		);
	}
}

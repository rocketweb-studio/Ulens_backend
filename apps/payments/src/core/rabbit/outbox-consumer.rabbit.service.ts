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
		console.log("[PAYMENTS][RMQ] Consumer init start");

		// очередь + бинды
		await this.ch.assertQueue("payments.auth.premium.activated.q", {
			durable: true,
			arguments: {
				"x-dead-letter-exchange": "app.dlx",
				"x-dead-letter-routing-key": "payments.auth.premium.activated.q.dlq",
			},
		});
		console.log("[PAYMENTS][RMQ] assertQueue OK:", "payments.auth.premium.activated.q");

		await this.ch.bindQueue("payments.auth.premium.activated.q", "app.events", "auth.user.premium.activated.v1");
		console.log("[PAYMENTS][RMQ] bindQueue OK:", `payments.auth.premium.activated.q <- app.events:auth.user.premium.activated.v1`);

		await this.ch.assertQueue("payments.auth.premium.activated.q.retry.1m", {
			durable: true,
			arguments: {
				"x-message-ttl": 60_000,
				"x-dead-letter-exchange": "app.events",
				"x-dead-letter-routing-key": "auth.user.premium.activated.v1",
			},
		});
		console.log("[PAYMENTS][RMQ] assertQueue OK:", "payments.auth.premium.activated.q.retry.1m");

		await this.ch.assertQueue("payments.auth.premium.activated.q.dlq", { durable: true });
		console.log("[PAYMENTS][RMQ] assertQueue OK:", "payments.auth.premium.activated.q.dlq");

		await this.ch.bindQueue("payments.auth.premium.activated.q.dlq", "app.dlx", "payments.auth.premium.activated.q.dlq");
		console.log("[PAYMENTS][RMQ] bindQueue OK:", `payments.auth.premium.activated.q.dlq <- app.dlx:payments.auth.premium.activated.q.dlq`);

		// быстрый статус очереди
		try {
			const st = await this.ch.checkQueue("payments.auth.premium.activated.q");
			console.log(`[PAYMENTS][RMQ] Queue status payments.auth.premium.activated.q -> messages=${st.messageCount}, consumers=${st.consumerCount}`);
		} catch (e) {
			console.warn("[PAYMENTS][RMQ] checkQueue warn:", (e as Error)?.message);
		}

		await this.ch.consume(
			"payments.auth.premium.activated.q",
			async (msg) => {
				if (!msg) return;
				try {
					// получаем сообщение из auth: { messageId, traceId, type, occurredAt, producer, payload: {...} }
					const raw = msg.content.toString();
					console.log("[PAYMENTS][RMQ] got message", {
						rk: msg.fields.routingKey,
						size: msg.content.length,
						headers: msg.properties.headers,
						bodyPreview: raw.slice(0, 500),
					});

					const env = JSON.parse(raw);

					const p = env.payload as {
						sessionId: string;
						userId: string;
						planId: string;
						premiumExpDate: string;
					};

					console.log("[PAYMENTS][RMQ] calling repo.finalizeAfterPremiumActivated", {
						messageId: env.messageId,
						userId: p.userId,
						planId: p.planId,
					});

					// завершаем транзакцию
					await this.repo.finalizeAfterPremiumActivated({
						messageId: env.messageId,
						sessionId: p.sessionId,
						userId: p.userId,
						planId: p.planId,
						premiumExpDate: p.premiumExpDate,
					});

					this.ch.ack(msg);
					console.log("[PAYMENTS][RMQ] acked message", { messageId: env.messageId });
				} catch (e) {
					console.error("[PAYMENTS][RMQ] handler error:", (e as Error)?.message);
					// простые ретраи → DLQ
					const retries = Number(msg.properties.headers?.["x-retries"] ?? 0);
					if (retries < 3) {
						this.ch.sendToQueue("payments.auth.premium.activated.q.retry.1m", msg.content, {
							persistent: true,
							contentType: "application/json",
							headers: { ...(msg.properties.headers || {}), "x-retries": retries + 1 },
						});
						this.ch.ack(msg);
						console.log("[PAYMENTS][RMQ] requeued to retry.1m", { retries: retries + 1 });
					} else {
						this.ch.publish("app.dlx", "payments.auth.premium.activated.q.dlq", msg.content, {
							persistent: true,
							contentType: "application/json",
							headers: msg.properties.headers,
						});
						this.ch.ack(msg);
						console.log("[PAYMENTS][RMQ] sent to DLQ payments.auth.premium.activated.q.dlq");
					}
				}
			},
			{ noAck: false },
		);
		console.log("[PAYMENTS][RMQ] Consumer started for payments.auth.premium.activated.q");
	}
}

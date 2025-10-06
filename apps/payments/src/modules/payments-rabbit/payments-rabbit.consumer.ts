import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import * as amqp from "amqplib";
import { RabbitEvents, RabbitExchanges, RabbitMainQueues, RMQ_CHANNEL, setupQueueWithRetryAndDLQ } from "@libs/rabbit/index";
import { TransactionService } from "@payments/modules/transaction/transaction.service";
import { PaymentProvidersEnum } from "@libs/contracts/index";
import { OutboxService } from "../event-store/outbox.service";

@Injectable()
export class PaymentsRabbitConsumer implements OnModuleInit {
	constructor(
		@Inject(RMQ_CHANNEL) private readonly ch: amqp.Channel,
		private readonly transactionService: TransactionService,
		private readonly outboxService: OutboxService,
	) {}

	async onModuleInit() {
		console.log("[PAYMENTS][RMQ] Consumer init start");

		const queuesToSetup = [
			{
				baseQueue: RabbitMainQueues.PAYMENTS_AUTH_PREMIUM_ACTIVATED_Q,
				exchange: RabbitExchanges.APP_EVENTS,
				routingKey: RabbitEvents.AUTH_PREMIUM_ACTIVATED,
			},
		];

		// 1) Устанавливаем очереди
		for (const queue of queuesToSetup) {
			await setupQueueWithRetryAndDLQ(this.ch, queue);
		}
		// быстрый статус очереди
		try {
			const st = await this.ch.checkQueue(RabbitMainQueues.PAYMENTS_AUTH_PREMIUM_ACTIVATED_Q);
			console.log(
				`[PAYMENTS][RMQ] Queue status ${RabbitMainQueues.PAYMENTS_AUTH_PREMIUM_ACTIVATED_Q} -> messages=${st.messageCount}, consumers=${st.consumerCount}`,
			);
		} catch (e) {
			console.warn("[PAYMENTS][RMQ] checkQueue warn:", (e as Error)?.message);
		}

		await this.ch.consume(
			RabbitMainQueues.PAYMENTS_AUTH_PREMIUM_ACTIVATED_Q,
			async (msg) => {
				if (!msg) return;
				try {
					// получаем сообщение из auth: { messageId, traceId, type, occurredAt, producer, payload: {...} }
					const raw = msg.content.toString();
					console.log("[PAYMENTS][RMQ] consumed event - auth.premium.activated");

					const payload = JSON.parse(raw) as {
						sessionId: string;
						userId: string;
						planId: string;
						userEmail: string;
						premiumExpDate: string;
						messageId: string;
					};

					// завершаем транзакцию
					await this.transactionService.finalizeAfterPremiumActivated({
						messageId: payload.messageId,
						sessionId: payload.sessionId,
						userId: payload.userId,
						planId: payload.planId,
						premiumExpDate: payload.premiumExpDate,
					});

					await this.outboxService.createOutboxNotificationEvent({
						sessionId: payload.sessionId,
						userId: payload.userId,
						planId: +payload.planId,
						userEmail: payload.userEmail,
						eventType: RabbitEvents.NOTIFICATION_SEND,
						isSuccessPayment: true,
						provider: PaymentProvidersEnum.PAYPAL,
						premiumExpDate: payload.premiumExpDate,
					});

					this.ch.ack(msg);
					console.log("[PAYMENTS][RMQ] acked message", { messageId: payload.messageId });
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
						this.ch.publish(RabbitExchanges.APP_DLX, "payments.auth.premium.activated.q.dlq", msg.content, {
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

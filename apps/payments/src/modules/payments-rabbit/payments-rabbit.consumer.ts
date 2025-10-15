import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import * as amqp from "amqplib";
import {
	APPLICATION_JSON,
	RabbitEvents,
	RabbitEventSources,
	RabbitExchanges,
	RabbitMainQueues,
	RMQ_CHANNEL,
	setupQueueWithRetryAndDLQ,
} from "@libs/rabbit/index";
import { TransactionService } from "@payments/modules/transaction/transaction.service";
import { PaymentProvidersEnum } from "@libs/contracts/index";
import { OutboxService } from "@payments/modules/event-store/outbox.service";
import { SubscriptionService } from "@payments/modules/subscription/subscription.service";
import { InboxService } from "@payments/modules/event-store/inbox.service";
import { INBOX_STATUS } from "@libs/constants/index";
@Injectable()
export class PaymentsRabbitConsumer implements OnModuleInit {
	constructor(
		@Inject(RMQ_CHANNEL) private readonly ch: amqp.Channel,
		private readonly transactionService: TransactionService,
		private readonly outboxService: OutboxService,
		private readonly subscriptionService: SubscriptionService,
		private readonly inboxService: InboxService,
	) {}

	async onModuleInit() {
		console.log("[PAYMENTS][RMQ] Consumer init start");

		const queuesToSetup = [
			{
				baseQueue: RabbitMainQueues.PAYMENTS_AUTH_PREMIUM_ACTIVATED_Q,
				exchange: RabbitExchanges.APP_EVENTS,
				routingKey: RabbitEvents.AUTH_PREMIUM_ACTIVATED,
			},
			{
				baseQueue: RabbitMainQueues.PAYMENTS_NOTIFICATION_CHECK_RENEWAL_Q,
				exchange: RabbitExchanges.APP_EVENTS,
				routingKey: RabbitEvents.NOTIFICATION_RENEWAL_CHECK,
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
					console.log(`[PAYMENTS][RMQ] consumed event - ${RabbitMainQueues.PAYMENTS_AUTH_PREMIUM_ACTIVATED_Q}`);

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

					await this.outboxService.createOutboxNotificationEmailEvent({
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
				} catch (e) {
					console.error("[PAYMENTS][RMQ] handler error:", (e as Error)?.message);
					// простые ретраи → DLQ
					const retries = Number(msg.properties.headers?.["x-retries"] ?? 0);
					if (retries < 3) {
						this.ch.sendToQueue(`${RabbitMainQueues.PAYMENTS_AUTH_PREMIUM_ACTIVATED_Q}.retry.1m`, msg.content, {
							persistent: true,
							contentType: APPLICATION_JSON,
							headers: { ...(msg.properties.headers || {}), "x-retries": retries + 1 },
						});
						this.ch.ack(msg);
						console.log("[PAYMENTS][RMQ] requeued to retry.1m", { retries: retries + 1 });
					} else {
						this.ch.publish(RabbitExchanges.APP_DLX, `${RabbitMainQueues.PAYMENTS_AUTH_PREMIUM_ACTIVATED_Q}.dlq`, msg.content, {
							persistent: true,
							contentType: APPLICATION_JSON,
							headers: msg.properties.headers,
						});
						this.ch.ack(msg);
						console.log("[PAYMENTS][RMQ] sent to DLQ payments.auth.premium.activated.q.dlq");
					}
				}
			},
			{ noAck: false },
		);

		await this.ch.consume(
			RabbitMainQueues.PAYMENTS_NOTIFICATION_CHECK_RENEWAL_Q,
			async (msg) => {
				if (!msg) return;
				try {
					const raw = msg.content.toString();
					console.log(`[PAYMENTS][RMQ] consumed event - ${RabbitMainQueues.PAYMENTS_NOTIFICATION_CHECK_RENEWAL_Q}`);

					const evt = JSON.parse(raw) as {
						userId: string;
						eventType: RabbitEvents.NOTIFICATION_RENEWAL_CHECK;
						messageId: string;
					};

					try {
						await this.inboxService.createInboxMessage({
							id: evt.messageId,
							type: RabbitEvents.NOTIFICATION_RENEWAL_CHECK,
							source: RabbitEventSources.NOTIFICATIONS_SERVICE,
							payload: evt,
							status: INBOX_STATUS.RECEIVED,
						});

						const subscription = await this.subscriptionService.getSubscriptionByUserId(evt.userId);

						await this.outboxService.createOutboxNotificationRenewalCheckedEvent({
							userId: evt.userId,
							eventType: RabbitEvents.PAYMENTS_RENEWAL_CHECKED,
							message: subscription.isAutoRenewal ? `Следующий платеж у вас спишется через 1 день` : `Ваша подписка истекает через 1 день`,
						});
					} catch (e) {
						console.error("[PAYMENTS][RMQ] handler error:", (e as Error)?.message);
					}

					this.ch.ack(msg);
				} catch (e) {
					console.error("[PAYMENTS][RMQ] handler error:", (e as Error)?.message);
					// простые ретраи → DLQ
					const retries = Number(msg.properties.headers?.["x-retries"] ?? 0);
					if (retries < 3) {
						this.ch.sendToQueue(`${RabbitMainQueues.PAYMENTS_NOTIFICATION_CHECK_RENEWAL_Q}.retry.1m`, msg.content, {
							persistent: true,
							contentType: APPLICATION_JSON,
							headers: { ...(msg.properties.headers || {}), "x-retries": retries + 1 },
						});
						this.ch.ack(msg);
						console.log("[PAYMENTS][RMQ] requeued to retry.1m", { retries: retries + 1 });
					} else {
						this.ch.publish(RabbitExchanges.APP_DLX, `${RabbitMainQueues.PAYMENTS_NOTIFICATION_CHECK_RENEWAL_Q}.dlq`, msg.content, {
							persistent: true,
							contentType: APPLICATION_JSON,
							headers: msg.properties.headers,
						});
						this.ch.ack(msg);
						console.log("[PAYMENTS][RMQ] sent to DLQ payments.auth.premium.activated.q.dlq");
					}
				}
			},
			{ noAck: false },
		);
	}
}

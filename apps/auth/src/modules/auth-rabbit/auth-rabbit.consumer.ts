import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import * as amqp from "amqplib";
import { APPLICATION_JSON, RabbitEvents, RabbitExchanges, RabbitMainQueues, RMQ_CHANNEL, setupQueueWithRetryAndDLQ } from "@libs/rabbit/index";
import { UserService } from "@auth/modules/user/user.service";
import { OutboxService } from "@auth/modules/event-store/outbox.service";

@Injectable()
export class AuthRabbitConsumer implements OnModuleInit {
	constructor(
		@Inject(RMQ_CHANNEL) private readonly ch: amqp.Channel,
		private readonly userService: UserService,
		private readonly outboxService: OutboxService,
	) {}

	async onModuleInit() {
		// === подписка на событие от payments ===
		const queuesToSetup = [
			{
				baseQueue: RabbitMainQueues.AUTH_PAYMENT_SUCCEEDED_Q,
				exchange: RabbitExchanges.APP_EVENTS,
				routingKey: RabbitEvents.PAYMENT_SUCCEEDED,
			},
		];

		// 1) Устанавливаем очереди
		for (const queue of queuesToSetup) {
			await setupQueueWithRetryAndDLQ(this.ch, queue);
		}

		// 2) Консьюм сообщения payment.succeeded
		await this.ch.consume(
			RabbitMainQueues.AUTH_PAYMENT_SUCCEEDED_Q,
			async (msg) => {
				if (!msg) return;
				try {
					const evt = JSON.parse(msg.content.toString()) as {
						messageId: string;
						sessionId: string;
						userId: string;
						planId: number;
						provider: string;
						expiresAt: string;
					};

					/**
					 * Когда мы читаем сообщение из очереди, Rabbit ждет от нас решения: ack (успешно) или nack (ошибка).
					 * Если мы просто делаем ack, то при повторной доставке того же события (например, из-за ретрая или из-за повторной публикации)
					 * 		мы можем обработать его дважды. (например, дважды начислим бонус).
					 * 		Раньше я такого не использовал но для работы с платежами и распределенными транзакциями это имеет смысл
					 * Идемпотентность = гарантия, что каждое событие будет обработано ровно один раз, даже если оно придёт повторно.
					 * Как это делается:
					 * В evt.messageId (мы его формируем в publisher через randomUUID()) содержится уникальный ID события.
					 * В auth или другом сервисе мы заводим таблицу в БД, например processed_messages(message_id TEXT PRIMARY KEY, processed_at TIMESTAMP).
					 * Перед тем, как реально обрабатывать событие:
					 * Проверяем в БД: обрабатывали ли мы уже это messageId.
					 * Если да → просто делаем ack и игнорируем.
					 * Если нет → обрабатываем, сохраняем запись с этим messageId, и только потом делаем ack.
					 */

					// даже если одно сообщение по какой-то причине пришло к нам несколько раз в applyPaymentSucceeded
					// мы поймем это по messageId и ниже просто ack(msg) без каких либо последствий
					const { premiumExpDate, email } = await this.userService.activatePremiumStatus({
						messageId: evt.messageId,
						sessionId: evt.sessionId,
						userId: evt.userId,
						planId: evt.planId,
						provider: evt.provider,
						expiresAt: evt.expiresAt,
					});

					// публикуем подтверждение в "payments-svc" о том, что на стороне auth-svc обновление статуса пользователя
					// прошло успешно и транзакцию можно закрывать
					await this.outboxService.createOutboxPremiumActivatedEvent({
						sessionId: evt.sessionId,
						userId: evt.userId,
						planId: evt.planId,
						premiumExpDate,
						userEmail: email,
						eventType: RabbitEvents.AUTH_PREMIUM_ACTIVATED,
					});
					console.log("[AUTH][RMQ] consumed event - payment.succeeded:");

					this.ch.ack(msg);
				} catch (_e) {
					const retries = Number(msg.properties.headers?.["x-retries"] ?? 0);
					if (retries < 3) {
						this.ch.sendToQueue(`${RabbitMainQueues.AUTH_PAYMENT_SUCCEEDED_Q}.retry.1m`, msg.content, {
							persistent: true,
							contentType: APPLICATION_JSON,
							headers: { ...(msg.properties.headers || {}), "x-retries": retries + 1 },
						});
						this.ch.ack(msg);
					} else {
						this.ch.publish(RabbitExchanges.APP_DLX, `${RabbitMainQueues.AUTH_PAYMENT_SUCCEEDED_Q}.dlq`, msg.content, {
							persistent: true,
							contentType: APPLICATION_JSON,
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

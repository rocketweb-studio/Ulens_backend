import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import * as amqp from "amqplib";
import { APPLICATION_JSON, RabbitEvents, RabbitEventSources, RabbitExchanges, RabbitMainQueues, RMQ_CHANNEL } from "@libs/rabbit/index";
import { EmailService } from "@notifications/modules/mail/mail.service";
import { MailPurpose } from "@libs/constants/notification.constants";
import { PaymentProvidersEnum } from "@libs/contracts/index";
import { setupQueueWithRetryAndDLQ } from "@libs/rabbit/rabbit.setup";
import { InboxService } from "@notifications/modules/event-store/inbox.service";

@Injectable()
export class NotificationRabbitConsumer implements OnModuleInit {
	constructor(
		@Inject(RMQ_CHANNEL) private readonly ch: amqp.Channel,
		private readonly emailService: EmailService,
		private readonly inboxService: InboxService,
	) {}

	async onModuleInit() {
		const queuesToSetup = [
			{
				baseQueue: RabbitMainQueues.NOTIFICATIONS_NOTIFICATION_SEND_Q,
				exchange: RabbitExchanges.APP_EVENTS,
				routingKey: RabbitEvents.NOTIFICATION_SEND,
			},
		];

		// 1) Устанавливаем очереди
		for (const queue of queuesToSetup) {
			await setupQueueWithRetryAndDLQ(this.ch, queue);
		}

		// 2) Консьюм сообщения notification.send
		await this.ch.consume(
			RabbitMainQueues.NOTIFICATIONS_NOTIFICATION_SEND_Q,
			async (msg) => {
				if (!msg) return;
				try {
					const evt = JSON.parse(msg.content.toString()) as {
						planId: number;
						userId: string;
						provider: PaymentProvidersEnum;
						messageId: string;
						plan_name: string;
						sessionId: string;
						userEmail: string;
						plan_price: number;
						plan_interval: string;
						premiumExpDate: string;
						plan_description: string;
						isSuccessPayment: boolean;
					};
					console.log("[notifications][RMQ] consumed event - notification.send");

					try {
						// сохраняем сообщение в БД
						await this.inboxService.createInboxMessage({
							id: evt.messageId,
							type: RabbitEvents.NOTIFICATION_SEND,
							source: RabbitEventSources.PAYMENTS_SERVICE,
							payload: evt,
						});

						// отправляем email
						await this.emailService.sendEmail(
							evt.userEmail,
							{ plan_name: evt.plan_name, premiumExpDate: evt.premiumExpDate },
							evt.isSuccessPayment ? MailPurpose.PAYMENT_SUCCEEDED : MailPurpose.PAYMENT_FAILED,
						);
					} catch (e) {
						console.error("[notifications][RMQ] error creating inbox message", e);
					}

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

					console.log("[notifications][RMQ] consumed event - notification.send:", evt);

					this.ch.ack(msg);
				} catch (_e) {
					const retries = Number(msg.properties.headers?.["x-retries"] ?? 0);
					if (retries < 3) {
						this.ch.sendToQueue(`${RabbitMainQueues.NOTIFICATIONS_NOTIFICATION_SEND_Q}.retry.1m`, msg.content, {
							persistent: true,
							contentType: APPLICATION_JSON,
							headers: { ...(msg.properties.headers || {}), "x-retries": retries + 1 },
						});
						this.ch.ack(msg);
					} else {
						this.ch.publish(RabbitExchanges.APP_DLX, `${RabbitMainQueues.NOTIFICATIONS_NOTIFICATION_SEND_Q}.dlq`, msg.content, {
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

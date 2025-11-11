import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import * as amqp from "amqplib";
import { APPLICATION_JSON, RabbitEvents, RabbitEventSources, RabbitExchanges, RabbitMainQueues, RMQ_CHANNEL } from "@libs/rabbit/index";
import { EmailService } from "@notifications/modules/mail/mail.service";
import { MailPurpose } from "@libs/constants/notification.constants";
import { PaymentProvidersEnum } from "@libs/contracts/index";
import { setupQueueWithRetryAndDLQ } from "@libs/rabbit/rabbit.setup";
import { InboxService } from "@notifications/modules/event-store/inbox.service";
import { OutboxService } from "@notifications/modules/event-store/outbox.service";
import { NotificationService } from "@notifications/modules/notification/notification.service";
import { FollowType } from "@libs/constants/index";

@Injectable()
export class NotificationRabbitConsumer implements OnModuleInit {
	constructor(
		@Inject(RMQ_CHANNEL) private readonly ch: amqp.Channel,
		private readonly emailService: EmailService,
		private readonly inboxService: InboxService,
		private readonly outboxService: OutboxService,
		private readonly notificationService: NotificationService,
	) {}

	async onModuleInit() {
		const queuesToSetup = [
			{
				baseQueue: RabbitMainQueues.NOTIFICATIONS_NOTIFICATION_SEND_Q,
				exchange: RabbitExchanges.APP_EVENTS,
				routingKey: RabbitEvents.NOTIFICATION_SEND,
			},
			{
				baseQueue: RabbitMainQueues.NOTIFICATIONS_PAYMENTS_RENEWAL_CHECKED_Q,
				exchange: RabbitExchanges.APP_EVENTS,
				routingKey: RabbitEvents.PAYMENTS_RENEWAL_CHECKED,
			},
			{
				baseQueue: RabbitMainQueues.NOTIFICATIONS_USER_DELETED_Q,
				exchange: RabbitExchanges.APP_EVENTS,
				routingKey: RabbitEvents.USER_DELETED,
			},
			{
				baseQueue: RabbitMainQueues.NOTIFICATIONS_FOLLOW_EVENT_Q,
				exchange: RabbitExchanges.APP_EVENTS,
				routingKey: RabbitEvents.FOLLOW_EVENT,
			},
			{
				baseQueue: RabbitMainQueues.NOTIFICATIONS_COMMENT_EVENT_Q,
				exchange: RabbitExchanges.APP_EVENTS,
				routingKey: RabbitEvents.COMMENT_EVENT,
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
					console.log(`[NOTIFICATIONS][RMQ] consumed event - ${RabbitMainQueues.NOTIFICATIONS_NOTIFICATION_SEND_Q}`);

					try {
						// сохраняем сообщение в БД
						await this.inboxService.createInboxMessage({
							id: evt.messageId,
							type: RabbitEvents.NOTIFICATION_SEND,
							source: RabbitEventSources.PAYMENTS_SERVICE,
							payload: evt,
						});

						if (evt.isSuccessPayment) {
							const dayBeforePremiumExpDate = new Date(evt.premiumExpDate);
							dayBeforePremiumExpDate.setDate(dayBeforePremiumExpDate.getDate() - 1);
							// ивент для gateway
							const formattedPremiumExpDate = new Date(evt.premiumExpDate).toLocaleDateString("ru-RU");
							const newNotification = await this.notificationService.createNotification({
								userId: evt.userId,
								message: `Ваша подписка активирована и действует до ${formattedPremiumExpDate}`,
							});
							console.log("newNotification", newNotification);
							await this.outboxService.createOutboxNotificationToGatewayEvent({
								userId: evt.userId,
								eventType: RabbitEvents.NOTIFICATION_SUBSCRIPTION,
								message: newNotification.message,
								notificationId: newNotification.id,
								sentAt: newNotification.sentAt,
								readAt: newNotification.readAt,
								scheduledAt: new Date(Date.now() + 30_000),
							});

							//! ивент для payments
							await this.outboxService.createOutboxNotificationToPaymentsEvent({
								userId: evt.userId,
								eventType: RabbitEvents.NOTIFICATION_RENEWAL_CHECK,
								scheduledAt: dayBeforePremiumExpDate,
							});
						}

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

		await this.ch.consume(
			RabbitMainQueues.NOTIFICATIONS_PAYMENTS_RENEWAL_CHECKED_Q,
			async (msg) => {
				if (!msg) return;
				try {
					const evt = JSON.parse(msg.content.toString()) as {
						userId: string;
						eventType: RabbitEvents.PAYMENTS_RENEWAL_CHECKED;
						messageId: string;
						message: string;
					};
					console.log(`[NOTIFICATIONS][RMQ] consumed event - ${RabbitMainQueues.NOTIFICATIONS_PAYMENTS_RENEWAL_CHECKED_Q}`);

					try {
						// сохраняем сообщение в БД
						await this.inboxService.createInboxMessage({
							id: evt.messageId,
							type: RabbitEvents.PAYMENTS_RENEWAL_CHECKED,
							source: RabbitEventSources.PAYMENTS_SERVICE,
							payload: evt,
						});

						const newNotification = await this.notificationService.createNotification({
							userId: evt.userId,
							message: evt.message,
						});

						await this.outboxService.createOutboxNotificationToGatewayEvent({
							userId: evt.userId,
							eventType: RabbitEvents.NOTIFICATION_SUBSCRIPTION,
							message: evt.message,
							notificationId: newNotification.id,
							sentAt: newNotification.sentAt,
							readAt: newNotification.readAt,
							scheduledAt: new Date(),
						});
					} catch (e) {
						console.error("[notifications][RMQ] error creating inbox message", e);
					}

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

		await this.ch.consume(
			RabbitMainQueues.NOTIFICATIONS_USER_DELETED_Q,
			async (msg) => {
				if (!msg) return;
				try {
					const evt = JSON.parse(msg.content.toString()) as {
						userId: string;
						messageId: string;
					};

					console.log(`[NOTIFICATIONS][RMQ] consumed event - ${RabbitMainQueues.NOTIFICATIONS_USER_DELETED_Q}`);

					try {
						// сохраняем сообщение в БД
						await this.inboxService.createInboxMessage({
							id: evt.messageId,
							type: RabbitEvents.USER_DELETED,
							source: RabbitEventSources.AUTH_SERVICE,
							payload: evt,
						});

						await this.notificationService.softDeleteUserNotifications(evt.userId);
					} catch (e) {
						console.error("[notifications][RMQ] error creating inbox message", e);
					}

					this.ch.ack(msg);
				} catch (_e) {
					const retries = Number(msg.properties.headers?.["x-retries"] ?? 0);
					if (retries < 3) {
						this.ch.sendToQueue(`${RabbitMainQueues.NOTIFICATIONS_USER_DELETED_Q}.retry.1m`, msg.content, {
							persistent: true,
							contentType: APPLICATION_JSON,
							headers: { ...(msg.properties.headers || {}), "x-retries": retries + 1 },
						});
						this.ch.ack(msg);
					} else {
						this.ch.publish(RabbitExchanges.APP_DLX, `${RabbitMainQueues.NOTIFICATIONS_USER_DELETED_Q}.dlq`, msg.content, {
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

		await this.ch.consume(
			RabbitMainQueues.NOTIFICATIONS_FOLLOW_EVENT_Q,
			async (msg) => {
				if (!msg) return;
				try {
					const evt = JSON.parse(msg.content.toString()) as {
						messageId: string;
						followingId: string;
						followingUserName: string;
						followType: FollowType;
					};
					console.log(`[NOTIFICATIONS][RMQ] consumed event - ${RabbitMainQueues.NOTIFICATIONS_FOLLOW_EVENT_Q}`);

					try {
						// сохраняем сообщение в БД
						await this.inboxService.createInboxMessage({
							id: evt.messageId,
							type: RabbitEvents.FOLLOW_EVENT,
							source: RabbitEventSources.AUTH_SERVICE,
							payload: evt,
						});

						const newNotification = await this.notificationService.createNotification({
							userId: evt.followingId,
							message:
								evt.followType === FollowType.FOLLOW
									? `${evt.followingUserName} подписался на ваши обновления`
									: `${evt.followingUserName} перестал следить за вашими обновлениями`,
						});
						console.log("newNotification", newNotification);
						await this.outboxService.createOutboxNotificationToGatewayEvent({
							userId: evt.followingId,
							eventType: RabbitEvents.NOTIFICATION_SUBSCRIPTION,
							message: newNotification.message,
							notificationId: newNotification.id,
							sentAt: newNotification.sentAt,
							readAt: newNotification.readAt,
							scheduledAt: new Date(),
						});
					} catch (e) {
						console.error("[notifications][RMQ] error creating inbox message", e);
					}

					this.ch.ack(msg);
				} catch (_e) {
					const retries = Number(msg.properties.headers?.["x-retries"] ?? 0);
					if (retries < 3) {
						this.ch.sendToQueue(`${RabbitMainQueues.NOTIFICATIONS_FOLLOW_EVENT_Q}.retry.1m`, msg.content, {
							persistent: true,
							contentType: APPLICATION_JSON,
							headers: { ...(msg.properties.headers || {}), "x-retries": retries + 1 },
						});
						this.ch.ack(msg);
					} else {
						this.ch.publish(RabbitExchanges.APP_DLX, `${RabbitMainQueues.NOTIFICATIONS_FOLLOW_EVENT_Q}.dlq`, msg.content, {
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

		await this.ch.consume(
			RabbitMainQueues.NOTIFICATIONS_COMMENT_EVENT_Q,
			async (msg) => {
				if (!msg) return;
				try {
					const evt = JSON.parse(msg.content.toString()) as {
						messageId: string;
						userId: string;
						commentatorId: string;
						commentatorUserName: string;
						postId: string;
						postDescription: string;
					};
					console.log(`[NOTIFICATIONS][RMQ] consumed event - ${RabbitMainQueues.NOTIFICATIONS_COMMENT_EVENT_Q}`);

					try {
						// сохраняем сообщение в БД
						await this.inboxService.createInboxMessage({
							id: evt.messageId,
							type: RabbitEvents.COMMENT_EVENT,
							source: RabbitEventSources.MAIN_SERVICE,
							payload: evt,
						});

						const newNotification = await this.notificationService.createNotification({
							userId: evt.userId,
							message: `${evt.commentatorUserName} оставил комментарий на вашем посте "${evt.postDescription.slice(0, 20)}..."`,
						});
						console.log("newNotification", newNotification);
						await this.outboxService.createOutboxNotificationToGatewayEvent({
							userId: evt.userId,
							eventType: RabbitEvents.NOTIFICATION_SUBSCRIPTION,
							message: newNotification.message,
							notificationId: newNotification.id,
							sentAt: newNotification.sentAt,
							readAt: newNotification.readAt,
							scheduledAt: new Date(),
						});
					} catch (e) {
						console.error("[notifications][RMQ] error creating inbox message", e);
					}

					this.ch.ack(msg);
				} catch (_e) {
					const retries = Number(msg.properties.headers?.["x-retries"] ?? 0);
					if (retries < 3) {
						this.ch.sendToQueue(`${RabbitMainQueues.NOTIFICATIONS_COMMENT_EVENT_Q}.retry.1m`, msg.content, {
							persistent: true,
							contentType: APPLICATION_JSON,
							headers: { ...(msg.properties.headers || {}), "x-retries": retries + 1 },
						});
						this.ch.ack(msg);
					} else {
						this.ch.publish(RabbitExchanges.APP_DLX, `${RabbitMainQueues.NOTIFICATIONS_COMMENT_EVENT_Q}.dlq`, msg.content, {
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

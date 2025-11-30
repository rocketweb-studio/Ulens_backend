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

		// Notification Send Handler
		await this.setupConsumer<{
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
		}>(RabbitMainQueues.NOTIFICATIONS_NOTIFICATION_SEND_Q, async (evt, msg) => {
			await this.createInboxMessageSafely(evt.messageId, RabbitEvents.NOTIFICATION_SEND, RabbitEventSources.PAYMENTS_SERVICE, evt);

			if (evt.isSuccessPayment) {
				const dayBeforePremiumExpDate = new Date(evt.premiumExpDate);
				dayBeforePremiumExpDate.setDate(dayBeforePremiumExpDate.getDate() - 1);
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
					metadata: null,
				});

				await this.outboxService.createOutboxNotificationToPaymentsEvent({
					userId: evt.userId,
					eventType: RabbitEvents.NOTIFICATION_RENEWAL_CHECK,
					scheduledAt: dayBeforePremiumExpDate,
				});
			}

			await this.emailService.sendEmail(
				evt.userEmail,
				{ plan_name: evt.plan_name, premiumExpDate: evt.premiumExpDate },
				evt.isSuccessPayment ? MailPurpose.PAYMENT_SUCCEEDED : MailPurpose.PAYMENT_FAILED,
			);
		});

		// Payments Renewal Checked Handler
		await this.setupConsumer<{
			userId: string;
			eventType: RabbitEvents.PAYMENTS_RENEWAL_CHECKED;
			messageId: string;
			message: string;
		}>(RabbitMainQueues.NOTIFICATIONS_PAYMENTS_RENEWAL_CHECKED_Q, async (evt, msg) => {
			await this.createInboxMessageSafely(evt.messageId, RabbitEvents.PAYMENTS_RENEWAL_CHECKED, RabbitEventSources.PAYMENTS_SERVICE, evt);
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
				metadata: null,
			});
		});

		// User Deleted Handler
		await this.setupConsumer<{
			userId: string;
			messageId: string;
		}>(RabbitMainQueues.NOTIFICATIONS_USER_DELETED_Q, async (evt, msg) => {
			await this.createInboxMessageSafely(evt.messageId, RabbitEvents.USER_DELETED, RabbitEventSources.AUTH_SERVICE, evt);
			await this.notificationService.softDeleteUserNotifications(evt.userId);
		});

		// Follow Event Handler
		await this.setupConsumer<{
			messageId: string;
			followingId: string;
			followingUserName: string;
			followType: FollowType;
		}>(RabbitMainQueues.NOTIFICATIONS_FOLLOW_EVENT_Q, async (evt, msg) => {
			await this.createInboxMessageSafely(evt.messageId, RabbitEvents.FOLLOW_EVENT, RabbitEventSources.AUTH_SERVICE, evt);
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
				metadata: {
					followingId: evt.followingId,
				},
			});
		});

		// Comment Event Handler
		await this.setupConsumer<{
			messageId: string;
			userId: string;
			commentatorId: string;
			commentatorUserName: string;
			postId: string;
			postDescription: string;
		}>(RabbitMainQueues.NOTIFICATIONS_COMMENT_EVENT_Q, async (evt, msg) => {
			await this.createInboxMessageSafely(evt.messageId, RabbitEvents.COMMENT_EVENT, RabbitEventSources.MAIN_SERVICE, evt);
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
				metadata: {
					postId: evt.postId,
				},
			});
		});
	}
	/**
	 * Generic consumer wrapper with error handling
	 */
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
	private async setupConsumer<T>(queueName: string, handler: (evt: T, msg: amqp.ConsumeMessage) => Promise<void>): Promise<void> {
		await this.ch.consume(
			queueName,
			async (msg) => {
				if (!msg) return;
				try {
					const evt = JSON.parse(msg.content.toString()) as T;
					console.log(`[NOTIFICATIONS][RMQ] consumed event - ${queueName}`);
					await handler(evt, msg);
					this.ch.ack(msg);
				} catch (error) {
					console.error(`[NOTIFICATIONS][RMQ] error processing message from ${queueName}`, error);
					this.handleMessageError(msg, queueName, error);
				}
			},
			{ noAck: false },
		);
	}

	/**
	 * Generic error handler with retry logic
	 */
	private handleMessageError(msg: amqp.ConsumeMessage, queueName: string, error: unknown): void {
		const retries = Number(msg.properties.headers?.["x-retries"] ?? 0);
		if (retries < 3) {
			this.ch.sendToQueue(`${queueName}.retry.1m`, msg.content, {
				persistent: true,
				contentType: APPLICATION_JSON,
				headers: { ...(msg.properties.headers || {}), "x-retries": retries + 1 },
			});
			this.ch.ack(msg);
		} else {
			this.ch.publish(RabbitExchanges.APP_DLX, `${queueName}.dlq`, msg.content, {
				persistent: true,
				contentType: APPLICATION_JSON,
				headers: msg.properties.headers,
			});
			this.ch.ack(msg);
		}
	}

	/**
	 * Helper to create inbox message with error handling
	 */
	private async createInboxMessageSafely(messageId: string, eventType: RabbitEvents, source: RabbitEventSources, payload: unknown): Promise<void> {
		try {
			await this.inboxService.createInboxMessage({
				id: messageId,
				type: eventType,
				source,
				payload,
			});
		} catch (e) {
			console.error("[notifications][RMQ] error creating inbox message", e);
		}
	}
}

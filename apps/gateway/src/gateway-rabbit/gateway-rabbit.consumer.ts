import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import * as amqp from "amqplib";
import { APPLICATION_JSON, RabbitEvents, RabbitExchanges, RabbitMainQueues, RMQ_CHANNEL, setupQueueWithRetryAndDLQ } from "@libs/rabbit/index";
import { WebsocketGateway } from "@gateway/websocket/websocket.gateway";

@Injectable()
export class GatewayRabbitConsumer implements OnModuleInit {
	constructor(
		@Inject(RMQ_CHANNEL) private readonly ch: amqp.Channel,
		private readonly websocketGateway: WebsocketGateway,
	) {}

	async onModuleInit() {
		// === подписка на событие от payments ===
		const queuesToSetup = [
			{
				baseQueue: RabbitMainQueues.GATEWAY_NOTIFICATION_SUBSCRIPTION_Q,
				exchange: RabbitExchanges.APP_EVENTS,
				routingKey: RabbitEvents.NOTIFICATION_SUBSCRIPTION,
			},
		];

		// 1) Устанавливаем очереди
		for (const queue of queuesToSetup) {
			await setupQueueWithRetryAndDLQ(this.ch, queue);
		}

		// 2) Консьюм сообщения payment.succeeded
		await this.ch.consume(
			RabbitMainQueues.GATEWAY_NOTIFICATION_SUBSCRIPTION_Q,
			async (msg) => {
				if (!msg) return;
				try {
					const evt = JSON.parse(msg.content.toString()) as {
						userId: string;
						userEmail: string;
						eventType: RabbitEvents.NOTIFICATION_SUBSCRIPTION;
						message: string;
						scheduledAt: null;
						notificationId: number;
						sentAt: Date;
						readAt: Date | null;
					};
					console.log(`[GATEWAY][RMQ] consumed event - ${RabbitMainQueues.GATEWAY_NOTIFICATION_SUBSCRIPTION_Q}`);

					await this.websocketGateway.sendNotificationToUser(evt.userId, {
						id: evt.notificationId,
						message: evt.message,
						sentAt: evt.sentAt,
						readAt: evt.readAt,
					});

					this.ch.ack(msg);
				} catch (_e) {
					const retries = Number(msg.properties.headers?.["x-retries"] ?? 0);
					if (retries < 3) {
						this.ch.sendToQueue(`${RabbitMainQueues.GATEWAY_NOTIFICATION_SUBSCRIPTION_Q}.retry.1m`, msg.content, {
							persistent: true,
							contentType: APPLICATION_JSON,
							headers: { ...(msg.properties.headers || {}), "x-retries": retries + 1 },
						});
						this.ch.ack(msg);
					} else {
						this.ch.publish(RabbitExchanges.APP_DLX, `${RabbitMainQueues.GATEWAY_NOTIFICATION_SUBSCRIPTION_Q}.dlq`, msg.content, {
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

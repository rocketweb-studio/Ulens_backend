import { Inject, Injectable } from "@nestjs/common";
import { EventBus } from "@libs/rabbit/rabbit.event-bus";
import { Cron, CronExpression } from "@nestjs/schedule";
import { RabbitExchanges, RMQ_EVENT_BUS } from "@libs/rabbit/rabbit.constants";
import { OutboxService } from "@notifications/modules/event-store/outbox.service";
import { NotificationService } from "@notifications/modules/notification/notification.service";
import { RabbitEvents } from "@libs/rabbit/rabbit.constants";
@Injectable()
export class NotificationRabbitPublisher {
	private running = false;

	constructor(
		@Inject(RMQ_EVENT_BUS) private readonly bus: EventBus,
		private readonly outboxService: OutboxService,
		private readonly notificationService: NotificationService,
	) {}

	// каждую 5 секунд проверяем новые события и публикуем их в RabbitMQ
	@Cron(CronExpression.EVERY_5_SECONDS)
	async handleCron() {
		await this.publishPendingOnce();
	}

	/**
	 * Берём чанку событий со status=PENDING (и nextAttemptAt <= now),
	 * публикуем в RabbitMQ и помечаем PUBLISHED. При ошибке — FAILED + backoff.
	 */

	async publishPendingOnce(chanckSize = 50): Promise<void> {
		if (this.running) return;
		this.running = true;
		try {
			const events = await this.outboxService.findPendingOutboxEvents(chanckSize);
			console.log("events", events);
			if (events.length === 0) return;

			for (const ev of events) {
				// берем событие: инкрементируем attempts ТОЛЬКО если оно ещё PENDING
				const claimed = await this.outboxService.updateOutboxPendingEvent(ev.id);
				if (claimed.count !== 1) continue; // кто-то другой уже схватил/изменил

				try {
					const publishedDate = new Date();

					const routingKey = ev.eventType; // напр. "payment.succeeded"
					const exchange = ev.topic ?? RabbitExchanges.APP_EVENTS; // дефолтный exchange
					const message =
						ev.eventType === RabbitEvents.NOTIFICATION_SUBSCRIPTION
							? ({ ...ev.payload, sentAt: publishedDate } as unknown as Record<string, any>)
							: (ev.payload as unknown as Record<string, any>);
					const headers = (ev.headers as Record<string, any>) || {};

					// Публикуем в Rabbit (или позже в Kafka)
					await this.bus.publishConfirm(exchange, routingKey, message, { headers });
					// Успех — помечаем PUBLISHED
					await this.outboxService.updateOutboxPublishedEvent(ev.id, publishedDate);
					if (ev.eventType === RabbitEvents.NOTIFICATION_SUBSCRIPTION) {
						await this.notificationService.markNotificationAsSent(message.notificationId, publishedDate);
					}

					console.log(`[NOTIFICATIONS][RMQ] Published outbox ${ev.id} -> ${exchange}:${routingKey}`);
				} catch (err) {
					// Ошибка — считаем backoff и планируем повтор
					const attempts = ev.attempts + 1;
					const delaySec = Math.min(5 * 2 ** (attempts - 1), 600); // 5s,10s,20s... cap 10m
					const next = new Date(Date.now() + delaySec * 1000);

					await this.outboxService.updateOutboxFailedEvent(ev.id, next);

					console.log(`Failed outbox ${ev.id}, retry in ${delaySec}s: ${(err as Error).message}`);
				}
			}
		} finally {
			this.running = false;
		}
	}
}

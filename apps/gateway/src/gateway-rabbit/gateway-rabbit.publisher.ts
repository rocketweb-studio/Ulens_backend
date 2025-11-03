//? пока в паблишер нет необходимости
// import { Inject, Injectable } from "@nestjs/common";
// import { EventBus } from "@libs/rabbit/rabbit.event-bus"; //  интерфейс из либы
// import { RabbitExchanges, RMQ_EVENT_BUS } from "@libs/rabbit/index";
// import { Cron, CronExpression } from "@nestjs/schedule";
// import { OutboxService } from "@auth/modules/event-store/outbox.service";

// @Injectable()
// export class AuthRabbitPublisher {
// 	private running = false;

// 	constructor(
// 		@Inject(RMQ_EVENT_BUS) private readonly bus: EventBus,
// 		private readonly outboxService: OutboxService,
// 	) {}

// 	// каждую 5 секунд проверяем новые события и публикуем их в RabbitMQ
// 	@Cron(CronExpression.EVERY_5_SECONDS)
// 	async handleCron() {
// 		await this.publishPendingOnce();
// 	}

// 	/**
// 	 * Берём чанку событий со status=PENDING (и nextAttemptAt <= now),
// 	 * публикуем в RabbitMQ и помечаем PUBLISHED. При ошибке — FAILED + backoff.
// 	 */
// 	async publishPendingOnce(chanckSize = 50): Promise<void> {
// 		if (this.running) return;
// 		this.running = true;
// 		try {
// 			const events = await this.outboxService.findPendingOutboxEvents(chanckSize);

// 			if (events.length === 0) return;

// 			for (const ev of events) {
// 				// берем событие: инкрементируем attempts ТОЛЬКО если оно ещё PENDING
// 				const claimed = await this.outboxService.updateOutboxPendingEvent(ev.id);

// 				if (claimed.count !== 1) continue; // кто-то другой уже схватил/изменил

// 				try {
// 					const routingKey = ev.eventType; // напр. "payment.succeeded"
// 					const exchange = ev.topic ?? RabbitExchanges.APP_EVENTS; // дефолтный exchange
// 					const message = ev.payload as unknown as Record<string, any>;
// 					const headers = (ev.headers as Record<string, any>) || {};

// 					// Публикуем в Rabbit (или позже в Kafka)
// 					await this.bus.publishConfirm(exchange, routingKey, message, { headers });

// 					await this.outboxService.updateOutboxPublishedEvent(ev.id);

// 					console.log(`[AUTH][RMQ] Published outbox ${ev.id} -> ${exchange}:${routingKey}`);
// 				} catch (err) {
// 					// Ошибка — считаем backoff и планируем повтор
// 					const attempts = ev.attempts + 1;
// 					const delaySec = Math.min(5 * 2 ** (attempts - 1), 600); // 5s,10s,20s... cap 10m
// 					const next = new Date(Date.now() + delaySec * 1000);

// 					await this.outboxService.updateOutboxFailedEvent(ev.id, next);

// 					console.log(`Failed outbox ${ev.id}, retry in ${delaySec}s: ${(err as Error).message}`);
// 				}
// 			}
// 		} finally {
// 			this.running = false;
// 		}
// 	}
// }

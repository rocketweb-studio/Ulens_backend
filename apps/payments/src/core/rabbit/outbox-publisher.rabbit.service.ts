import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "@payments/core/prisma/prisma.service";
import { EventBus } from "@libs/rabbit/rabbit.event-bus";

@Injectable()
export class OutboxPublisherService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(OutboxPublisherService.name);
	private timer: NodeJS.Timeout | null = null;
	private running = false;

	constructor(
		private readonly prisma: PrismaService,
		@Inject("EVENT_BUS") private readonly bus: EventBus,
	) {}

	onModuleInit() {
		// простой интервал для демо (каждые 2 сек). Потом можно заменить на cron/queue.
		this.timer = setInterval(
			() =>
				this.publishPendingOnce().catch((err) => {
					this.logger.error("Unhandled error in publishPendingOnce", err);
				}),
			2000,
		);
	}

	onModuleDestroy() {
		if (this.timer) clearInterval(this.timer);
	}

	/**
	 * Берём чанку событий со status=PENDING (и nextAttemptAt <= now),
	 * публикуем в RabbitMQ и помечаем PUBLISHED. При ошибке — FAILED + backoff.
	 */
	async publishPendingOnce(chanckSize = 50): Promise<void> {
		if (this.running) return;
		this.running = true;
		try {
			const now = new Date();

			const events = await this.prisma.outboxEvent.findMany({
				where: {
					status: "PENDING",
					OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: now } }],
				},
				orderBy: { createdAt: "asc" },
				take: chanckSize,
			});

			if (events.length === 0) return;

			for (const ev of events) {
				// берем событие: инкрементируем attempts ТОЛЬКО если оно ещё PENDING
				const claimed = await this.prisma.outboxEvent.updateMany({
					where: { id: ev.id, status: "PENDING" },
					data: { attempts: { increment: 1 } },
				});
				if (claimed.count !== 1) continue; // кто-то другой уже схватил/изменил

				try {
					const routingKey = ev.eventType; // напр. "payment.succeeded"
					const exchange = ev.topic ?? "payments.events"; // дефолтный exchange
					const message = ev.payload as unknown as Record<string, any>;
					const headers = (ev.headers as Record<string, any>) || {};

					// Публикуем в Rabbit (или позже в Kafka)
					await this.bus.publishConfirm(exchange, routingKey, message, { headers });

					// Успех — помечаем PUBLISHED
					await this.prisma.outboxEvent.update({
						where: { id: ev.id },
						data: { status: "PUBLISHED", publishedAt: new Date(), nextAttemptAt: null },
					});

					this.logger.log(`Published outbox ${ev.id} -> ${exchange}:${routingKey}`);
				} catch (err) {
					// Ошибка — считаем backoff и планируем повтор
					const attempts = ev.attempts + 1;
					const delaySec = Math.min(5 * 2 ** (attempts - 1), 600); // 5s,10s,20s... cap 10m
					const next = new Date(Date.now() + delaySec * 1000);

					await this.prisma.outboxEvent.update({
						where: { id: ev.id },
						data: { status: "FAILED", nextAttemptAt: next },
					});

					this.logger.warn(`Failed outbox ${ev.id}, retry in ${delaySec}s: ${(err as Error).message}`);
				}
			}
		} finally {
			this.running = false;
		}
	}
}

// apps/payments/src/core/outbox/outbox-publisher.kafka.service.ts
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "@payments/core/prisma/prisma.service";
import { EventBus } from "@libs/kafka/kafka.event-bus";

@Injectable()
export class OutboxPublisherKafkaService implements OnModuleInit, OnModuleDestroy {
	private timer: NodeJS.Timeout | null = null;
	private running = false;

	constructor(
		private readonly prisma: PrismaService,
		@Inject("EVENT_BUS") private readonly bus: EventBus, // ← KafkaEventBus
	) {}

	onModuleInit() {
		// console.log("[PAYMENTS][OutboxPublisher][INIT] start interval 2s, topic env:", process.env.KAFKA_EVENTS_TOPIC);
		this.timer = setInterval(() => {
			// console.log("[PAYMENTS][OutboxPublisher][TICK] invoking publishPendingOnce()");
			this.publishPendingOnce().catch((err) => console.log("Unhandled error in publishPendingOnce", err));
		}, 2000);
	}

	onModuleDestroy() {
		console.log("[PAYMENTS][OutboxPublisher][DESTROY] clearing interval");
		if (this.timer) clearInterval(this.timer);
	}

	// Берём PENDING-события, публикуем в Kafka (topic/key), отмечаем PUBLISHED. Ошибка → FAILED + nextAttemptAt
	async publishPendingOnce(chunkSize = 50): Promise<void> {
		if (this.running) {
			console.log("[PAYMENTS][OutboxPublisher][SKIP] already running, skip this tick");
			return;
		}
		this.running = true;
		// console.log("[PAYMENTS][OutboxPublisher][START]", { chunkSize, at: new Date().toISOString() });
		try {
			const now = new Date();

			const events = await this.prisma.outboxEvent.findMany({
				where: { status: "PENDING", OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: now } }] },
				orderBy: { createdAt: "asc" },
				take: chunkSize,
			});
			// console.log("[PAYMENTS][OutboxPublisher][FETCH]", { pending: events.length });

			if (events.length === 0) {
				// console.log("[PAYMENTS][OutboxPublisher][EMPTY] no pending events");
				return;
			}

			const topic = process.env.KAFKA_EVENTS_TOPIC ?? "app.events.v1"; // единый топик
			for (const ev of events) {
				// атомарно «захватываем» событие
				const claimed = await this.prisma.outboxEvent.updateMany({
					where: { id: ev.id, status: "PENDING" },
					data: { attempts: { increment: 1 } },
				});
				if (claimed.count !== 1) {
					console.log("[PAYMENTS][OutboxPublisher][CLAIM_SKIP]", { id: ev.id, claimed: claimed.count });
					continue;
				}

				try {
					const message = ev.payload as Record<string, any>;
					const baseHeaders = (ev.headers as Record<string, any>) || {};
					const headers = { ...baseHeaders, rk: ev.eventType }; // тип события в headers для быстрой фильтрации

					// ключ для партиционирования/порядка (userId → порядковая обработка по пользователю)
					const key: string = message?.userId ?? message?.transactionId ?? (ev.aggregateId as string) ?? ev.id;
					console.log("[PAYMENTS][OutboxPublisher][PUBLISH_ATTEMPT]", {
						id: ev.id,
						topic,
						key,
						rk: headers.rk,
						attempts: ev.attempts + 1,
					});

					// Публикация с подтверждением брокера (acks=all, timeout)
					await this.bus.publishConfirm(topic, key, message, { headers, timeoutMs: 10_000 });

					await this.prisma.outboxEvent.update({
						where: { id: ev.id },
						data: { status: "PUBLISHED", publishedAt: new Date(), nextAttemptAt: null },
					});
					console.log(`[PAYMENTS][OutboxPublisher][PUBLISHED] id=${ev.id} -> ${topic} (key=${key})`);
				} catch (err) {
					const attempts = ev.attempts + 1;
					const delaySec = Math.min(5 * 2 ** (attempts - 1), 600); // 5s → 10m
					const next = new Date(Date.now() + delaySec * 1000);

					await this.prisma.outboxEvent.update({
						where: { id: ev.id },
						data: { status: "FAILED", nextAttemptAt: next },
					});

					console.log("[PAYMENTS][OutboxPublisher][FAILED]", {
						id: ev.id,
						attempts,
						retryInSec: delaySec,
						error: (err as Error)?.message,
					});
				}
			}
		} finally {
			this.running = false;
			// console.log("[PAYMENTS][OutboxPublisher][END]", { at: new Date().toISOString() });
		}
	}
}

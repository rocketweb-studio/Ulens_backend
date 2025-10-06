import { PrismaService } from "@auth/core/prisma/prisma.service";
import { IOutboxCommandRepository } from "@auth/modules/event-store/outbox.interface";
import { randomUUID } from "node:crypto";
import { OutboxAggregateType, RabbitExchanges } from "@libs/rabbit/rabbit.constants";
import { CreateOutBoxPremiumActivatedEventDto } from "@auth/modules/event-store/dto/create-outbox-premium-event.dto";
import { Injectable } from "@nestjs/common";
import { OutboxEventStatuses } from "@libs/constants/index";

@Injectable()
export class OutboxCommandRepository implements IOutboxCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createOutboxPremiumActivatedEvent(dto: CreateOutBoxPremiumActivatedEventDto): Promise<string> {
		const { sessionId, userId, planId, userEmail, eventType, premiumExpDate } = dto;
		const messageId = randomUUID();
		const createdOutboxTransactionEvent = await this.prisma.outboxEvent.create({
			data: {
				aggregateType: OutboxAggregateType.PREMIUM_ACTIVATED,
				eventType: eventType, // ивент тайп по которому будем консьюмить сообщение
				attempts: 0,
				topic: RabbitExchanges.APP_EVENTS, // топик в который полетят сообщения; опционально: имя exchange/route для паблишера
				payload: {
					messageId,
					sessionId,
					userId,
					planId,
					userEmail,
					premiumExpDate: premiumExpDate,
				},
			},
		});
		return createdOutboxTransactionEvent.id;
	}
	async updateOutboxPendingEvent(id: string): Promise<any> {
		return await this.prisma.outboxEvent.updateMany({
			where: { id: id, status: OutboxEventStatuses.PENDING },
			data: { attempts: { increment: 1 } },
		});
	}

	async updateOutboxPublishedEvent(id: string): Promise<any> {
		return await this.prisma.outboxEvent.update({
			where: { id: id },
			data: { status: OutboxEventStatuses.PUBLISHED, publishedAt: new Date(), nextAttemptAt: null },
		});
	}

	async updateOutboxFailedEvent(id: string, next: Date): Promise<any> {
		return await this.prisma.outboxEvent.update({
			where: { id: id },
			data: { status: OutboxEventStatuses.FAILED, nextAttemptAt: next },
		});
	}

	async findPendingOutboxEvents(chanckSize): Promise<any[]> {
		const now = new Date();

		const events = await this.prisma.outboxEvent.findMany({
			where: {
				status: OutboxEventStatuses.PENDING,
				OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: now } }],
			},
			orderBy: { createdAt: "asc" },
			take: chanckSize,
		});

		return events;
	}
}

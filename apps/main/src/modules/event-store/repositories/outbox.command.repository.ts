import { PrismaService } from "@main/core/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { IOutboxCommandRepository } from "@main/modules/event-store/outbox.interface";
import { OutboxStatus } from "@main/core/prisma/generated";
import { randomUUID } from "node:crypto";
import { OutboxAggregateType, RabbitEvents, RabbitExchanges } from "@libs/rabbit/rabbit.constants";
import { CreateOutboxCommentEventDto } from "../dto/create-outbox-comment.dto";

@Injectable()
export class OutboxCommandRepository implements IOutboxCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createOutboxCommentEvent(tx: any, dto: CreateOutboxCommentEventDto): Promise<string> {
		const messageId = randomUUID();
		const createdOutboxCommentEvent = await tx.outboxEvent.create({
			data: {
				aggregateType: OutboxAggregateType.COMMENT_ADDED,
				eventType: RabbitEvents.COMMENT_EVENT, // ивент тайп по которому будем консьюмить сообщение
				attempts: 0,
				topic: RabbitExchanges.APP_EVENTS, //топик в который полетят сообщения; опционально: имя exchange/route для паблишера
				payload: {
					messageId,
					...dto,
				},
			},
		});
		return createdOutboxCommentEvent.id;
	}

	async findPendingOutboxEvents(chanckSize: number): Promise<any[]> {
		const now = new Date();
		return await this.prisma.outboxEvent.findMany({
			where: {
				status: OutboxStatus.PENDING,
				OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: now } }],
			},
			orderBy: { createdAt: "asc" },
			take: chanckSize,
		});
	}

	async updateOutboxPendingEvent(id: string): Promise<any> {
		return await this.prisma.outboxEvent.updateMany({
			where: { id: id, status: OutboxStatus.PENDING },
			data: { attempts: { increment: 1 } },
		});
	}

	async updateOutboxPublishedEvent(id: string, publishedAt: Date): Promise<any> {
		const existing = await this.prisma.outboxEvent.findUnique({
			where: { id },
			select: { payload: true },
		});
		if (!existing) return null;

		const updatedPayload = {
			...(existing.payload as Record<string, any>),
			sentAt: publishedAt,
		};
		return await this.prisma.outboxEvent.update({
			where: { id },
			data: {
				status: OutboxStatus.PUBLISHED,
				publishedAt,
				payload: updatedPayload,
				nextAttemptAt: null,
			},
		});
	}

	async updateOutboxFailedEvent(id: string, next: Date): Promise<any> {
		return await this.prisma.outboxEvent.update({
			where: { id: id },
			data: { status: OutboxStatus.FAILED, nextAttemptAt: next },
		});
	}
}

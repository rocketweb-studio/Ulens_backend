import { PrismaService } from "@notifications/core/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { IOutboxCommandRepository } from "@notifications/modules/event-store/outbox.interface";
import { OutboxAggregateType, RabbitExchanges } from "@libs/rabbit/rabbit.constants";
import { randomUUID } from "node:crypto";
import { OutboxStatus } from "@notifications/core/prisma/generated";
import { CreateOutboxToGatewayDto, CreateOutboxToPaymentsDto } from "@notifications/modules/event-store/dto/create-outbox.dto";

@Injectable()
export class OutboxCommandRepository implements IOutboxCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createOutboxNotificationToGatewayEvent(dto: CreateOutboxToGatewayDto): Promise<string> {
		const messageId = randomUUID();
		const createdOutboxTransactionEvent = await this.prisma.outboxEvent.create({
			data: {
				aggregateType: OutboxAggregateType.NOTIFICATION_SUBSCRIPTION,
				eventType: dto.eventType, // ивент тайп по которому будем консьюмить сообщение
				attempts: 0,
				topic: RabbitExchanges.APP_EVENTS, //топик в который полетят сообщения; опционально: имя exchange/route для паблишера
				scheduledAt: dto.scheduledAt,
				payload: {
					messageId,
					userId: dto.userId,
					message: dto.message,
					notificationId: dto.notificationId,
					sentAt: dto.sentAt,
					readAt: dto.readAt,
				},
			},
		});
		return createdOutboxTransactionEvent.id;
	}

	async createOutboxNotificationToPaymentsEvent(dto: CreateOutboxToPaymentsDto): Promise<string> {
		const messageId = randomUUID();
		const createdOutboxTransactionEvent = await this.prisma.outboxEvent.create({
			data: {
				aggregateType: OutboxAggregateType.NOTIFICATION_SUBSCRIPTION,
				eventType: dto.eventType, // ивент тайп по которому будем консьюмить сообщение
				attempts: 0,
				topic: RabbitExchanges.APP_EVENTS, //топик в который полетят сообщения; опционально: имя exchange/route для паблишера
				scheduledAt: dto.scheduledAt,
				payload: {
					messageId,
					userId: dto.userId,
				},
			},
		});
		return createdOutboxTransactionEvent.id;
	}

	async findPendingOutboxEvents(chanckSize: number): Promise<any[]> {
		const now = new Date();
		return await this.prisma.outboxEvent.findMany({
			where: {
				status: OutboxStatus.PENDING,
				OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: now } }, { scheduledAt: { lte: now } }],
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

	async updateOutboxPublishedEvent(id: string): Promise<any> {
		return await this.prisma.outboxEvent.update({
			where: { id: id },
			data: { status: OutboxStatus.PUBLISHED, publishedAt: new Date(), nextAttemptAt: null },
		});
	}

	async updateOutboxFailedEvent(id: string, next: Date): Promise<any> {
		return await this.prisma.outboxEvent.update({
			where: { id: id },
			data: { status: OutboxStatus.FAILED, nextAttemptAt: next },
		});
	}
}

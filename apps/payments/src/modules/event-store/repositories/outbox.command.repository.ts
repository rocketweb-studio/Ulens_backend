import { PrismaService } from "@payments/core/prisma/prisma.service";
import { IOutboxCommandRepository } from "@payments/modules/event-store/outbox.interface";
import { CreateOutBoxTransactionEventDto } from "@payments/modules/event-store/dto/create-outbox-transaction-event.dto";
import { randomUUID } from "node:crypto";
import { OutboxAggregateType, RabbitExchanges } from "@libs/rabbit/rabbit.constants";
import { OutBoxNotificationEventDto } from "@payments/modules/event-store/dto/create-outbox-notification-event.dto";
import { Injectable } from "@nestjs/common";
import { OutboxEventStatuses } from "@libs/constants/index";

@Injectable()
export class OutboxCommandRepository implements IOutboxCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createOutboxTransactionEvent(dto: CreateOutBoxTransactionEventDto): Promise<string> {
		const { sessionId, userId, planId, provider, expiresAt } = dto;
		const messageId = randomUUID();
		const createdOutboxTransactionEvent = await this.prisma.outboxEvent.create({
			data: {
				aggregateType: OutboxAggregateType.TRANSACTION,
				eventType: dto.eventType, // ивент тайп по которому будем консьюмить сообщение
				attempts: 0,
				topic: RabbitExchanges.APP_EVENTS, // топик в который полетят сообщения; опционально: имя exchange/route для паблишера
				// status: PENDING — по умолчанию из Prisma-схемы
				payload: {
					messageId,
					sessionId,
					userId,
					planId,
					provider,
					expiresAt,
				},
			},
		});
		return createdOutboxTransactionEvent.id;
	}

	async createOutboxNotificationEvent(dto: OutBoxNotificationEventDto): Promise<string> {
		const messageId = randomUUID();
		const createdOutboxTransactionEvent = await this.prisma.outboxEvent.create({
			data: {
				aggregateType: OutboxAggregateType.NOTIFICATION,
				eventType: dto.eventType, // ивент тайп по которому будем консьюмить сообщение
				attempts: 0,
				topic: RabbitExchanges.APP_EVENTS, //топик в который полетят сообщения; опционально: имя exchange/route для паблишера
				payload: {
					messageId,
					sessionId: dto.sessionId,
					userId: dto.userId,
					planId: dto.planId,
					provider: dto.provider,
					userEmail: dto.userEmail,
					premiumExpDate: dto.premiumExpDate,
					plan_name: dto.plan_name,
					plan_interval: dto.plan_interval,
					plan_price: dto.plan_price,
					plan_description: dto.plan_description,
					isSuccessPayment: dto.isSuccessPayment,
				},
			},
		});
		return createdOutboxTransactionEvent.id;
	}

	async findPendingOutboxEvents(chanckSize: number): Promise<any[]> {
		const now = new Date();
		return await this.prisma.outboxEvent.findMany({
			where: {
				status: OutboxEventStatuses.PENDING,
				OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: now } }],
			},
			orderBy: { createdAt: "asc" },
			take: chanckSize,
		});
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
}

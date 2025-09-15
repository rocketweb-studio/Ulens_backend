import { Injectable } from "@nestjs/common";
import { ISubscriptionCommandRepository } from "../subscription.interface";
import { PrismaService } from "@payments/core/prisma/prisma.service";
import { CreateTransactionInternalDto } from "../dto/create-transaction.dto";
import { randomUUID } from "crypto";
// import { Prisma } from "@payments/core/prisma/generated";

@Injectable()
export class PrismaSubscriptionCommandRepository implements ISubscriptionCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	getUniqueSubscription(planCode: string): Promise<any> {
		const result = this.prisma.plan.findUnique({
			where: { code: planCode },
		});
		return result;
	}

	async createTransaction(dto: CreateTransactionInternalDto): Promise<any> {
		return this.prisma.$transaction(async (tx) => {
			// 1.Создаем транзакцию
			const createdTx = await tx.transaction.create({
				data: {
					id: dto.id, // = transactionId
					userId: dto.userId,
					amountCents: dto.amountCents,
					currency: dto.currency,
					provider: dto.provider,
					status: dto.status, // 'PENDING'
					idempotencyKey: dto.idempotencyKey, // @unique
					correlationId: dto.correlationId,
					metadata: dto.metadata, // { planCode: ... }
				},
			});

			// 2.пишем outbox-coбытие (PENDING) в той же транзакции
			const messageId = randomUUID();
			await tx.outboxEvent.create({
				data: {
					aggregateType: "transaction",
					aggregateId: dto.id, // transactionId
					eventType: "payment.succeeded", // !! ивент тайп по которому будем консьюмить сообщение
					payload: {
						messageId,
						correlationId: dto.correlationId,
						transactionId: dto.id,
						userId: dto.userId,
						planCode: dto.metadata.planCode,
						amountCents: dto.amountCents,
						currency: dto.currency,
						provider: dto.provider,
						status: dto.status, // 'PENDING' (можно будет сменить на 'SUCCEEDED', когда включим Stripe)
						occurredAt: new Date().toISOString(),
					},
					headers: { idempotencyKey: dto.idempotencyKey },
					// status: PENDING — по умолчанию из Prisma-схемы
					attempts: 0,
					correlationId: dto.correlationId,
					topic: "app.events", // !!топик в который полетят сообщения; опционально: имя exchange/route для паблишера
				},
			});

			return createdTx;
		});
	}
}

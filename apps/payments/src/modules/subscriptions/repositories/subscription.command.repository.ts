import { Injectable } from "@nestjs/common";
import { ISubscriptionCommandRepository } from "../subscription.interface";
import { PrismaService } from "@payments/core/prisma/prisma.service";
import { CreateTransactionInternalDto } from "../dto/create-transaction.dto";
import { randomUUID } from "crypto";
import { PremiumActivatedInput } from "../dto/premium-activated.dto";
import { PaymentStatus } from "@payments/core/prisma/generated";

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

	async finalizeAfterPremiumActivated(input: PremiumActivatedInput): Promise<void> {
		const { messageId, transactionId, userId, planCode } = input;

		await this.prisma.$transaction(async (tx) => {
			// 1) Inbox идемпотентно
			const ins = await tx.inboxMessage.createMany({
				data: [
					{
						id: messageId,
						type: "auth.user.premium.activated.v1",
						source: "auth-service",
						payload: input,
						status: "RECEIVED",
					},
				],
				skipDuplicates: true,
			});
			if (ins.count === 0) return; // уже обработали

			// 2) Проверяем транзакцию и план
			const trx = await tx.transaction.findUnique({ where: { id: transactionId } });
			if (!trx) {
				await tx.inboxMessage.update({
					where: { id: messageId },
					data: { status: "FAILED", error: `Transaction ${transactionId} not found`, processedAt: new Date() },
				});
				return;
			}

			const plan = await tx.plan.findUnique({ where: { code: planCode } });
			if (!plan) {
				await tx.inboxMessage.update({
					where: { id: messageId },
					data: { status: "FAILED", error: `Plan ${planCode} not found`, processedAt: new Date() },
				});
				return;
			}

			// 3) Создаём подписку
			const sub = await tx.subscription.create({
				data: {
					userId,
					planId: plan.id,
					provider: trx.provider,
					// возможно позже: currentPeriodEnd: new Date(input.premiumUntil ?? new Date()),
				},
			});

			// 4) Обновляем транзакцию → SUCCESS + линкуем подписку
			await tx.transaction.update({
				where: { id: trx.id },
				data: {
					status: PaymentStatus.SUCCEEDED,
					subscriptionId: sub.id,
				},
			});

			// 5) Inbox → PROCESSED
			await tx.inboxMessage.update({
				where: { id: messageId },
				data: { status: "PROCESSED", processedAt: new Date() },
			});
		});
	}
}

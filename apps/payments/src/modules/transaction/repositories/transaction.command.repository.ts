import { PaymentProvidersEnum, TransactionStatusEnum } from "@libs/contracts/index";
import { ITransactionCommandRepository } from "../transaction.interface";
import { PrismaService } from "@payments/core/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { UpdateTransactionDto } from "@payments/modules/transaction/dto/update-transaction.dto";
import { CreateTransactionDto } from "@payments/modules/transaction/dto/create-transaction.dto";
import { PremiumActivatedInput } from "@payments/modules/transaction/dto/permium-activated.input.dto";
import { INBOX_STATUS, OUTBOX_STATUS } from "@libs/constants/outbox-statuses.constants";
import { IInboxCommandRepository } from "@payments/modules/event-store/inbox.interface";
import { RabbitEvents, RabbitEventSources } from "@libs/rabbit/rabbit.constants";

@Injectable()
export class TransactionCommandRepository implements ITransactionCommandRepository {
	constructor(
		private readonly prisma: PrismaService,
		private readonly inboxCommandRepository: IInboxCommandRepository,
	) {}

	async createTransaction(dto: CreateTransactionDto): Promise<number> {
		const { userId, plan, stripeSubscriptionId, stripeSessionId, paypalSessionId, paypalPlanId, provider, status, createdAt, expiresAt } = dto;
		const expiresLinkAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 часа
		const createdTransaction = await this.prisma.transaction.create({
			data: {
				userId: userId,
				amount: plan.price,
				currency: plan.currency,
				planId: plan.id,
				stripeSubscriptionId: stripeSubscriptionId,
				stripeSessionId: stripeSessionId,
				paypalSessionId: paypalSessionId,
				paypalPlanId: paypalPlanId,
				provider: provider,
				expiresLinkAt: expiresLinkAt,
				status: status || TransactionStatusEnum.PENDING,
				createdAt: createdAt || new Date(),
				expiresAt: expiresAt || null,
			},
		});
		return createdTransaction.id;
	}

	async updateTransaction(id: string | number, provider: PaymentProvidersEnum, data: Partial<UpdateTransactionDto>): Promise<boolean> {
		if (provider === PaymentProvidersEnum.STRIPE) {
			const updatedTransaction = await this.prisma.transaction.updateMany({
				where: {
					stripeSessionId: id as string,
					status: TransactionStatusEnum.PENDING,
				},
				data: data,
			});
			return updatedTransaction.count > 0;
		} else if (provider === PaymentProvidersEnum.PAYPAL) {
			const updatedTransaction = await this.prisma.transaction.updateMany({
				where: {
					id: id as number,
					status: TransactionStatusEnum.PENDING,
				},
				data: data,
			});
			return updatedTransaction.count > 0;
		}

		return false;
	}

	async findTransactionById(id: number): Promise<any> {
		const transaction = await this.prisma.transaction.findUnique({ where: { id } });
		return transaction;
	}

	async changeStatusOfExpiredTransactions() {
		await this.prisma.transaction.updateMany({
			where: {
				status: TransactionStatusEnum.PENDING,
				expiresLinkAt: { lt: new Date() },
			},
			data: {
				status: TransactionStatusEnum.EXPIRED,
			},
		});
	}

	async finalizeAfterPremiumActivated(input: PremiumActivatedInput): Promise<void> {
		const { messageId, sessionId, userId } = input;

		await this.prisma.$transaction(async (tx) => {
			// 1) Создаем Inbox
			await this.inboxCommandRepository.createInboxMessage(tx, {
				id: messageId,
				type: RabbitEvents.AUTH_PREMIUM_ACTIVATED,
				source: RabbitEventSources.AUTH_SERVICE,
				payload: input,
				status: INBOX_STATUS.RECEIVED,
			});

			// 2) Обновляем outboxFlowStatus
			await tx.transaction.updateMany({
				where: {
					userId,
					OR: [{ stripeSessionId: sessionId }, { paypalSessionId: sessionId }],
				},
				data: {
					outboxFlowStatus: OUTBOX_STATUS.PROCESSED,
				},
			});

			// 3) Обновляем Inbox -> PROCESSED
			await this.inboxCommandRepository.updateInboxMessage(tx, {
				id: messageId,
				status: INBOX_STATUS.PROCESSED,
			});
		});
	}

	async deleteDeletedTransactions(): Promise<void> {
		const { count } = await this.prisma.transaction.deleteMany({
			where: { deletedAt: { not: null, lt: new Date(Date.now() - 1000 * 60 * 60 * 24) } },
		});
		console.log(`Deleted deleted transactions: [${count}]`);
	}
}

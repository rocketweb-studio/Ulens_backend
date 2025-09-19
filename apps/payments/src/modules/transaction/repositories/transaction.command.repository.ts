import { PaymentProvidersEnum, TransactionStatusEnum } from "@libs/contracts/index";
import { ITransactionCommandRepository } from "../transaction.interface";
import { PrismaService } from "@payments/core/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { UpdateTransactionDto } from "../dto/update-transaction.dto";
import { CreateTransactionDto } from "../dto/create-transaction.dto";

@Injectable()
export class TransactionCommandRepository implements ITransactionCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createTransaction(dto: CreateTransactionDto): Promise<number> {
		const { userId, plan, stripeSubscriptionId, stripeSessionId, paypalSessionId, paypalPlanId, provider, status, createdAt, expiresAt } = dto;
		const expiresLinkAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 часа
		const createdTransaction = await this.prisma.transaction.create({
			data: {
				userId: userId,
				amount: plan.price,
				currency: plan.currency,
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
}

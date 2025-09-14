import { PrismaService } from "@payments/core/prisma/prisma.service";
import { ITransactionQueryRepository } from "../transaction.interface";
import { PaymentProvidersEnum, TransactionOutputDto } from "@libs/contracts/index";
import { Transaction } from "@payments/core/prisma/generated/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TransactionQueryRepository implements ITransactionQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getTransactions(userId: string): Promise<TransactionOutputDto[]> {
		const transactions = await this.prisma.transaction.findMany({ where: { userId } });
		return transactions.map((transaction) => this._mapTransactionToViewDto(transaction));
	}

	private _mapTransactionToViewDto(transaction: Transaction): TransactionOutputDto {
		return {
			id: transaction.id,
			amount: transaction.amount,
			currency: transaction.currency,
			status: transaction.status,
			provider: transaction.provider as PaymentProvidersEnum,
			userId: transaction.userId,
			createdAt: transaction.createdAt as Date,
			expiresAt: transaction.expiresAt as Date,
		};
	}
}

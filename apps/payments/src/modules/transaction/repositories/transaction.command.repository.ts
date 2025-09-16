import { TransactionStatusEnum } from "@libs/contracts/index";
import { ITransactionCommandRepository } from "../transaction.interface";
import { PrismaService } from "@payments/core/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { UpdateTransactionDto } from "../dto/update-transaction.dto";
import { CreateTransactionDto } from "../dto/create-transaction.dto";

@Injectable()
export class TransactionCommandRepository implements ITransactionCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createTransaction(dto: CreateTransactionDto): Promise<string> {
		const { userId, plan, stripeSubscriptionId, stripeSessionId, provider } = dto;
		const createdTransaction = await this.prisma.transaction.create({
			data: {
				userId: userId,
				amount: plan.price,
				currency: plan.currency,
				stripeSubscriptionId: stripeSubscriptionId,
				stripeSessionId: stripeSessionId,
				provider: provider,
			},
		});
		return createdTransaction.id;
	}

	async updateTransaction(sessionId: string, data: Partial<UpdateTransactionDto>): Promise<boolean> {
		const updatedTransaction = await this.prisma.transaction.updateMany({
			where: {
				stripeSessionId: sessionId,
				status: TransactionStatusEnum.PENDING,
			},
			data: data,
		});

		return updatedTransaction.count > 0;
	}
}

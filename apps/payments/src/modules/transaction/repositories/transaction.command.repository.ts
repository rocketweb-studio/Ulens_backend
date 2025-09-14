import { PlanOutputDto, TransactionStatusEnum } from "@libs/contracts/index";
import { ITransactionCommandRepository } from "../transaction.interface";
import { PrismaService } from "@payments/core/prisma/prisma.service";
import { PaymentProvidersEnum } from "@libs/contracts/index";
import { Injectable } from "@nestjs/common";
import { UpdateTransactionDto } from "../dto/update-transaction.dto";

@Injectable()
export class TransactionCommandRepository implements ITransactionCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createTransaction(userId: string, plan: PlanOutputDto, stripeSubscriptionId: string, provider: PaymentProvidersEnum): Promise<string> {
		const createdTransaction = await this.prisma.transaction.create({
			data: {
				userId: userId,
				amount: plan.price,
				currency: plan.currency,
				stripeSubscriptionId: stripeSubscriptionId,
				provider: provider,
			},
		});
		return createdTransaction.id;
	}

	async updateTransaction(id: string, data: Partial<UpdateTransactionDto>): Promise<boolean> {
		const updatedTransaction = await this.prisma.transaction.updateMany({
			where: {
				stripeSubscriptionId: id,
				status: TransactionStatusEnum.PENDING,
			},
			data: data,
		});

		return updatedTransaction.count > 0;
	}
}

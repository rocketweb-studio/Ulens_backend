import { PrismaService } from "@payments/core/prisma/prisma.service";
import { ITransactionQueryRepository } from "@payments/modules/transaction/transaction.interface";
import {
	CurrencyEnum,
	PaginationWithSortQueryDto,
	PaymentIntervalEnum,
	PaymentProvidersEnum,
	TransactionOutputDto,
	TransactionStatusEnum,
	TransactionWithPageInfoOutputDto,
} from "@libs/contracts/index";
import { Plan, Transaction } from "@payments/core/prisma/generated/client";
import { Injectable } from "@nestjs/common";
import { OUTBOX_STATUS } from "@libs/constants/outbox-statuses.constants";

@Injectable()
export class TransactionQueryRepository implements ITransactionQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getTransactionsByUserId(userId: string, query: PaginationWithSortQueryDto): Promise<TransactionWithPageInfoOutputDto> {
		const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc" } = query;

		const [totalCount, transactions] = await Promise.all([
			this.prisma.transaction.count({ where: { userId, outboxFlowStatus: OUTBOX_STATUS.PROCESSED } }),
			this.prisma.transaction.findMany({
				where: { userId, outboxFlowStatus: OUTBOX_STATUS.PROCESSED },
				include: {
					plan: true,
				},
				skip: (pageNumber - 1) * pageSize,
				take: pageSize,
				orderBy: { [sortBy]: sortDirection },
			}),
		]);

		return {
			totalCount,
			pageSize,
			page: pageNumber,
			items: transactions.map((t) => this._mapTransactionToViewDto(t)),
		};
	}

	async getTransactionsByUserIds(userIds: string[], query: PaginationWithSortQueryDto): Promise<TransactionWithPageInfoOutputDto> {
		const { pageNumber, pageSize, sortBy, sortDirection } = query;
		const [totalCount, transactions] = await Promise.all([
			this.prisma.transaction.count({ where: { userId: { in: userIds }, outboxFlowStatus: OUTBOX_STATUS.PROCESSED } }),
			this.prisma.transaction.findMany({
				where: { userId: { in: userIds }, outboxFlowStatus: OUTBOX_STATUS.PROCESSED },
				include: { plan: true },
				skip: (pageNumber - 1) * pageSize,
				take: pageSize,
				orderBy: { [sortBy]: sortDirection },
			}),
		]);

		return {
			totalCount,
			pageSize,
			page: pageNumber,
			items: transactions.map((t) => this._mapTransactionToViewDto(t)),
		};
	}

	async getTransactions(query: PaginationWithSortQueryDto): Promise<TransactionWithPageInfoOutputDto> {
		const { pageNumber, pageSize, sortBy, sortDirection } = query;

		const [totalCount, transactions] = await Promise.all([
			this.prisma.transaction.count({ where: { outboxFlowStatus: OUTBOX_STATUS.PROCESSED } }),
			this.prisma.transaction.findMany({
				where: { outboxFlowStatus: OUTBOX_STATUS.PROCESSED },
				include: { plan: true },
				skip: (pageNumber - 1) * pageSize,
				take: pageSize,
				orderBy: { [sortBy]: sortDirection },
			}),
		]);

		return {
			totalCount,
			pageSize,
			page: pageNumber,
			items: transactions.map((t) => this._mapTransactionToViewDto(t)),
		};
	}

	private _mapTransactionToViewDto(transaction: Transaction & { plan: Plan | null }): TransactionOutputDto {
		const status =
			transaction.outboxFlowStatus === OUTBOX_STATUS.PROCESSED
				? TransactionStatusEnum.SUCCESS
				: transaction.outboxFlowStatus === OUTBOX_STATUS.FAILED
					? TransactionStatusEnum.FAILED
					: TransactionStatusEnum.PENDING;
		return {
			id: transaction.id,
			amount: transaction.amount,
			currency: transaction.currency as CurrencyEnum,
			status: status as TransactionStatusEnum,
			provider: transaction.provider as PaymentProvidersEnum,
			userId: transaction.userId,
			createdAt: transaction.createdAt as Date,
			expiresAt: transaction.expiresAt as Date,
			interval: transaction.plan?.interval as PaymentIntervalEnum,
		};
	}
}

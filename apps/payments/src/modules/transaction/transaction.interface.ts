/**
 *Using abstract classes lets Nest use the class itself as the DI token,
 *   so your service can inject by type without @Inject()
 */

import { PaginationWithSortQueryDto, PaymentProvidersEnum, TransactionWithPageInfoOutputDto } from "@libs/contracts/index";
import { UpdateTransactionDto } from "@payments/modules/transaction/dto/update-transaction.dto";
import { CreateTransactionDto } from "@payments/modules/transaction/dto/create-transaction.dto";
import { PremiumActivatedInput } from "@payments/modules/transaction/dto/permium-activated.input.dto";

export abstract class ITransactionQueryRepository {
	abstract getTransactionsByUserId(userId: string, query: PaginationWithSortQueryDto): Promise<TransactionWithPageInfoOutputDto>;
	abstract getTransactionsByUserIds(userIds: string[], query: PaginationWithSortQueryDto): Promise<TransactionWithPageInfoOutputDto>;
	abstract getTransactions(query: PaginationWithSortQueryDto): Promise<TransactionWithPageInfoOutputDto>;
}

export abstract class ITransactionCommandRepository {
	abstract createTransaction(dto: CreateTransactionDto): Promise<number>;
	abstract updateTransaction(id: string | number, provider: PaymentProvidersEnum, data: Partial<UpdateTransactionDto>): Promise<boolean>;
	abstract findTransactionById(id: number): Promise<any>;
	abstract changeStatusOfExpiredTransactions(): Promise<void>;
	abstract finalizeAfterPremiumActivated(input: PremiumActivatedInput): Promise<void>;
	abstract deleteDeletedTransactions(): Promise<void>;
	abstract softDeleteUserTransactions(userId: string): Promise<void>;
}

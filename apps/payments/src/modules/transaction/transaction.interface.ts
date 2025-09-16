/**
 *Using abstract classes lets Nest use the class itself as the DI token,
 *   so your service can inject by type without @Inject()
 */

import { TransactionOutputDto } from "@libs/contracts/index";
import { UpdateTransactionDto } from "@payments/modules/transaction/dto/update-transaction.dto";
import { CreateTransactionDto } from "./dto/create-transaction.dto";

export abstract class ITransactionQueryRepository {
	abstract getTransactions(userId: string): Promise<TransactionOutputDto[]>;
}

export abstract class ITransactionCommandRepository {
	abstract createTransaction(dto: CreateTransactionDto): Promise<string>;
	abstract updateTransaction(sessionId: string, data: Partial<UpdateTransactionDto>): Promise<boolean>;
}

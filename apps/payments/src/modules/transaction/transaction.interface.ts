/**
 *Using abstract classes lets Nest use the class itself as the DI token,
 *   so your service can inject by type without @Inject()
 */

import { PaymentProvidersEnum, TransactionOutputDto } from "@libs/contracts/index";
import { UpdateTransactionDto } from "@payments/modules/transaction/dto/update-transaction.dto";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { CreateOutBoxTransactionEventDto } from "./dto/create-outbox-transaction-event.dto";
import { PremiumActivatedInput } from "./dto/permium-activated.input.dto";

export abstract class ITransactionQueryRepository {
	abstract getTransactions(userId: string): Promise<TransactionOutputDto[]>;
}

export abstract class ITransactionCommandRepository {
	abstract createTransaction(dto: CreateTransactionDto): Promise<number>;
	abstract updateTransaction(id: string | number, provider: PaymentProvidersEnum, data: Partial<UpdateTransactionDto>): Promise<boolean>;
	abstract findTransactionById(id: number): Promise<any>;
	abstract changeStatusOfExpiredTransactions(): Promise<void>;
	abstract createOutboxTransactionEvent(dto: CreateOutBoxTransactionEventDto): Promise<string>;
	abstract finalizeAfterPremiumActivated(input: PremiumActivatedInput): Promise<void>;
}

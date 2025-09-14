/**
 *Using abstract classes lets Nest use the class itself as the DI token,
 *   so your service can inject by type without @Inject()
 */

import { TransactionOutputDto, PaymentProvidersEnum, PlanOutputDto } from "@libs/contracts/index";
import { UpdateTransactionDto } from "@payments/modules/transaction/dto/update-transaction.dto";

export abstract class ITransactionQueryRepository {
	abstract getTransactions(userId: string): Promise<TransactionOutputDto[]>;
}

export abstract class ITransactionCommandRepository {
	abstract createTransaction(userId: string, plan: PlanOutputDto, stripeSubscriptionId: string, provider: PaymentProvidersEnum): Promise<string>;
	abstract updateTransaction(id: string, data: Partial<UpdateTransactionDto>): Promise<boolean>;
}

/**
 *Using abstract classes lets Nest use the class itself as the DI token,
 *   so your service can inject by type without @Inject()
 */

import { CreateTransactionInternalDto } from "./dto/create-transaction.dto";
import { PremiumActivatedInput } from "./dto/premium-activated.dto";

export abstract class ISubscriptionQueryRepository {}

export abstract class ISubscriptionCommandRepository {
	abstract getUniqueSubscription(code: string): Promise<any>;
	abstract createTransaction(dto: CreateTransactionInternalDto): Promise<any>;
	abstract finalizeAfterPremiumActivated(input: PremiumActivatedInput): Promise<void>;
}

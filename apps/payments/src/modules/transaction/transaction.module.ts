import { Module } from "@nestjs/common";
import { TransactionService } from "@payments/modules/transaction/transaction.service";
import { TransactionController } from "@payments/modules/transaction/transaction.controller";
import { CoreEnvConfig } from "@payments/core/core-env.config";
import { TransactionCommandRepository } from "./repositories/transaction.command.repository";
import { TransactionQueryRepository } from "./repositories/transaction.query.repository";
import { ITransactionCommandRepository, ITransactionQueryRepository } from "./transaction.interface";
import { IPlanQueryRepository } from "../plan/plan.interface";
import { PrismaPlanQueryRepository } from "../plan/repositories/plan.query.repository";
import { SubscriptionModule } from "../subscription/subscription.module";

@Module({
	imports: [SubscriptionModule],
	controllers: [TransactionController],
	providers: [
		TransactionService,
		CoreEnvConfig,
		{ provide: ITransactionCommandRepository, useClass: TransactionCommandRepository },
		{ provide: ITransactionQueryRepository, useClass: TransactionQueryRepository },
		{ provide: IPlanQueryRepository, useClass: PrismaPlanQueryRepository },
	],
	exports: [TransactionService],
})
export class TransactionModule {}

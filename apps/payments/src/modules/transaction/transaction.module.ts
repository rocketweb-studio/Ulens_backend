import { Module } from "@nestjs/common";
// import { RabbitEventBus } from "@libs/rabbit/index";
import { TransactionService } from "@payments/modules/transaction/transaction.service";
import { TransactionController } from "@payments/modules/transaction/transaction.controller";
import { CoreEnvConfig } from "@payments/core/core-env.config";
import { TransactionCommandRepository } from "@payments/modules/transaction/repositories/transaction.command.repository";
import { TransactionQueryRepository } from "@payments/modules/transaction/repositories/transaction.query.repository";
import { ITransactionCommandRepository, ITransactionQueryRepository } from "@payments/modules/transaction/transaction.interface";
import { IPlanQueryRepository } from "@payments/modules/plan/plan.interface";
import { PrismaPlanQueryRepository } from "@payments/modules/plan/repositories/plan.query.repository";
import { SubscriptionModule } from "@payments/modules/subscription/subscription.module";
import { InboxCommandRepository } from "@payments/modules/event-store/repositories/inbox.command.repository";
import { IInboxCommandRepository } from "@payments/modules/event-store/inbox.interface";

@Module({
	imports: [SubscriptionModule],
	controllers: [TransactionController],
	providers: [
		TransactionService,
		CoreEnvConfig,
		{ provide: ITransactionCommandRepository, useClass: TransactionCommandRepository },
		{ provide: ITransactionQueryRepository, useClass: TransactionQueryRepository },
		{ provide: IPlanQueryRepository, useClass: PrismaPlanQueryRepository },
		{ provide: IInboxCommandRepository, useClass: InboxCommandRepository },
	],
	exports: [TransactionService, ITransactionCommandRepository],
})
export class TransactionModule {}

import { Module } from "@nestjs/common";
import { SubscriptionService } from "@payments/modules/subscription/subscription.service";
import { PrismaSubscriptionCommandRepository } from "@payments/modules/subscription/infrastructure/subscription.command.repository";
import { PrismaSubscriptionQueryRepository } from "@payments/modules/subscription/infrastructure/subscription.query.repository";
import { ISubscriptionCommandRepository, ISubscriptionQueryRepository } from "@payments/modules/subscription/subscription.interface";
import { SubscriptionController } from "@payments/modules/subscription/subscription.controller";

@Module({
	imports: [],
	controllers: [SubscriptionController],
	providers: [
		SubscriptionService,
		{ provide: ISubscriptionCommandRepository, useClass: PrismaSubscriptionCommandRepository },
		{ provide: ISubscriptionQueryRepository, useClass: PrismaSubscriptionQueryRepository },
	],
	exports: [SubscriptionService],
})
export class SubscriptionModule {}

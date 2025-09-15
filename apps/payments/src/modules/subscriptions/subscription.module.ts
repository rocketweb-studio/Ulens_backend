import { Module } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionController } from "./subscription.controller";
import { ISubscriptionCommandRepository } from "./subscription.interface";
import { PrismaSubscriptionCommandRepository } from "./repositories/subscription.command.repository";
import { OutboxPublisherService } from "@payments/core/outbox/outbox-publisher.service.ts";
import { RabbitEventBus } from "@libs/rabbit/index";

@Module({
	imports: [],
	providers: [
		{ provide: ISubscriptionCommandRepository, useClass: PrismaSubscriptionCommandRepository },
		// { provide: ISubscriptionQueryRepository, useClass: PrismaSubscriptionQueryRepository },
		SubscriptionService,
		OutboxPublisherService,
		{ provide: "EVENT_BUS", useClass: RabbitEventBus },
	],
	controllers: [SubscriptionController],
	exports: [],
})
export class SubscriptionModule {}

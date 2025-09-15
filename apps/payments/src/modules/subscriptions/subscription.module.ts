import { Module } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionController } from "./subscription.controller";
import { PrismaSubscriptionQueryRepository } from "./repositories/subscription.query.repository";
import { ISubscriptionQueryRepository } from "./subscription.interface";

@Module({
	imports: [],
	providers: [
		// { provide: IPostCommandRepository, useClass: PrismaPostCommandRepository },
		{ provide: ISubscriptionQueryRepository, useClass: PrismaSubscriptionQueryRepository },
		SubscriptionService,
	],
	controllers: [SubscriptionController],
	exports: [],
})
export class SubscriptionModule {}

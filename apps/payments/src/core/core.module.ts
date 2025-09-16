import { forwardRef, Module } from "@nestjs/common";
import { configModule } from "@payments/core/env-config/env-config.module";
import { CoreEnvConfig } from "@payments/core/core-env.config";
import { PrismaModule } from "@payments/core/prisma/prisma.module";
import { RedisModule } from "@libs/redis/redis.module";
import { RabbitModule } from "@libs/rabbit/index";
import { SubscriptionModule } from "../modules/subscriptions/subscription.module";
import { RabbitPaymentsConsumer } from "./outbox/outbox-consumer.service";

@Module({
	imports: [configModule, PrismaModule, RedisModule.forRoot(), RabbitModule, forwardRef(() => SubscriptionModule)],
	controllers: [],
	providers: [CoreEnvConfig, RabbitPaymentsConsumer],
	exports: [CoreEnvConfig],
})
export class CoreModule {}

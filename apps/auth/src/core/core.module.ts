import { configModule } from "@auth/core/env-config/env-config.module";
import { Module } from "@nestjs/common";
import { CoreEnvConfig } from "@auth/core/core.config";
import { PrismaModule } from "@auth/core/prisma/prisma.module";
// rabbitmq заглушка
import { TestConsumer } from "./rabbit/test.consumer";
import { AuthEventsPublisher } from "./rabbit/events.publisher";
import { RabbitModule } from "@libs/rabbit/index";
import { ScheduleModule } from "@nestjs/schedule";
import { RedisModule } from "@libs/redis/redis.module";

@Module({
	imports: [
		configModule,
		PrismaModule,
		// rabbitmq заглушка
		RabbitModule,
		ScheduleModule.forRoot(),
		RedisModule.forRoot(),
	],
	controllers: [],
	providers: [
		CoreEnvConfig,
		// rabbitmq заглушка
		TestConsumer,
		AuthEventsPublisher,
	],
	exports: [
		CoreEnvConfig,
		// rabbitmq заглушка
		AuthEventsPublisher,
	],
})
export class CoreModule {}

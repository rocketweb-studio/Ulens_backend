import { configModule } from "@auth/core/env-config/env-config.module";
import { Module } from "@nestjs/common";
import { CoreEnvConfig } from "@auth/core/core.config";
import { PrismaModule } from "@auth/core/prisma/prisma.module";
import { RabbitTestConsumer } from "./rabbit/events.consumer";
import { AuthEventsPublisher } from "./rabbit/events.publisher";
import { RabbitModule } from "@libs/rabbit/index";
import { ScheduleModule } from "@nestjs/schedule";
import { RedisModule } from "@libs/redis/redis.module";
import { KafkaModule } from "@libs/kafka/index";
import { AuthKafkaConsumer } from "./kafka/auth.kafka.consumer";
import { AuthKafkaPublisher } from "./kafka/auth.kafka.publisher";

@Module({
	imports: [configModule, PrismaModule, RabbitModule, ScheduleModule.forRoot(), RedisModule.forRoot(), KafkaModule],
	controllers: [],
	providers: [CoreEnvConfig, RabbitTestConsumer, AuthEventsPublisher, AuthKafkaPublisher, AuthKafkaConsumer],
	exports: [CoreEnvConfig, AuthEventsPublisher, AuthKafkaPublisher],
})
export class CoreModule {}

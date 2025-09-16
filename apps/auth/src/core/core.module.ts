import { configModule } from "@auth/core/env-config/env-config.module";
import { forwardRef, Module } from "@nestjs/common";
import { CoreEnvConfig } from "@auth/core/core.config";
import { PrismaModule } from "@auth/core/prisma/prisma.module";
import { RabbitAuthConsumer } from "./rabbit/events.consumer";
import { EventsPublisher } from "./rabbit/events.publisher";
import { RabbitModule } from "@libs/rabbit/index";
import { ScheduleModule } from "@nestjs/schedule";
import { RedisModule } from "@libs/redis/redis.module";
import { KafkaModule } from "@libs/kafka/index";
import { AuthKafkaConsumer } from "./kafka/auth.kafka.consumer";
import { AuthKafkaPublisher } from "./kafka/auth.kafka.publisher";
import { UserModule } from "@auth/modules/user/user.module";
import { RabbitEventBus } from "@libs/rabbit/rabbit.event-bus";

@Module({
	imports: [configModule, PrismaModule, RabbitModule, ScheduleModule.forRoot(), RedisModule.forRoot(), KafkaModule, UserModule, forwardRef(() => UserModule)],
	controllers: [],
	providers: [CoreEnvConfig, RabbitAuthConsumer, EventsPublisher, AuthKafkaPublisher, AuthKafkaConsumer, { provide: "EVENT_BUS", useClass: RabbitEventBus }],
	exports: [CoreEnvConfig, EventsPublisher, AuthKafkaPublisher],
})
export class CoreModule {}

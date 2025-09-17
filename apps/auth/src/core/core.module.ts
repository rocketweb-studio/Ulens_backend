import { configModule } from "@auth/core/env-config/env-config.module";
import { forwardRef, Module } from "@nestjs/common";
import { CoreEnvConfig } from "@auth/core/core.config";
import { PrismaModule } from "@auth/core/prisma/prisma.module";
import { RabbitAuthConsumer } from "./rabbit/auth.rabbit.consumer";
import { RabbitEventsPublisher } from "./rabbit/auth.rabbit.publisher";
import { RabbitModule } from "@libs/rabbit/index";
import { ScheduleModule } from "@nestjs/schedule";
import { RedisModule } from "@libs/redis/redis.module";
import { KafkaEventBus, KafkaModule } from "@libs/kafka/index";
import { AuthKafkaConsumer } from "./kafka/auth.kafka.consumer";
import { AuthKafkaPublisher } from "./kafka/auth.kafka.publisher";
import { UserModule } from "@auth/modules/user/user.module";
// import { RabbitEventBus } from "@libs/rabbit/rabbit.event-bus";

@Module({
	imports: [configModule, PrismaModule, RabbitModule, ScheduleModule.forRoot(), RedisModule.forRoot(), KafkaModule, UserModule, forwardRef(() => UserModule)],
	controllers: [],
	providers: [
		CoreEnvConfig,
		RabbitAuthConsumer,
		RabbitEventsPublisher,
		AuthKafkaPublisher,
		AuthKafkaConsumer,
		//  { provide: "EVENT_BUS", useClass: RabbitEventBus },    // если Rabbit switchMessageBroker**
		{ provide: "EVENT_BUS", useClass: KafkaEventBus }, // если Kafka  switchMessageBroker**
	],
	exports: [CoreEnvConfig, RabbitEventsPublisher, AuthKafkaPublisher],
})
export class CoreModule {}

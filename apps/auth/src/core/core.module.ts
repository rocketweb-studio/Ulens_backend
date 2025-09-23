import { configModule } from "@auth/core/env-config/env-config.module";
import { forwardRef, Module } from "@nestjs/common";
import { CoreEnvConfig } from "@auth/core/core.config";
import { PrismaModule } from "@auth/core/prisma/prisma.module";
import { RabbitModule } from "@libs/rabbit/index";
import { RabbitEventBus } from "@libs/rabbit/rabbit.event-bus";
import { ScheduleModule } from "@nestjs/schedule";
import { RedisModule } from "@libs/redis/redis.module";
import { RabbitAuthConsumer } from "./rabbit/auth.rabbit.consumer";
import { RabbitEventsPublisher } from "./rabbit/auth.rabbit.publisher";
import { UserModule } from "../modules/user/user.module";

@Module({
	imports: [configModule, PrismaModule, RabbitModule, ScheduleModule.forRoot(), RedisModule.forRoot(), forwardRef(() => UserModule)],
	controllers: [],
	providers: [
		CoreEnvConfig,
		RabbitAuthConsumer,
		RabbitEventsPublisher,
		{ provide: "EVENT_BUS", useClass: RabbitEventBus }, // если Rabbit switchMessageBroker**
	],
	exports: [CoreEnvConfig],
})
export class CoreModule {}

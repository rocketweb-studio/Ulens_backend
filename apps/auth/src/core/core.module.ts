import { configModule } from "@auth/core/env-config/env-config.module";
import { Module } from "@nestjs/common";
import { CoreEnvConfig } from "@auth/core/core.config";
import { PrismaModule } from "@auth/core/prisma/prisma.module";
import { TestConsumer } from "./rabbit/test.consumer";
import { AuthEventsPublisher } from "./rabbit/events.publisher";

@Module({
	imports: [configModule, PrismaModule],
	controllers: [],
	providers: [CoreEnvConfig, TestConsumer, AuthEventsPublisher],
	exports: [CoreEnvConfig, AuthEventsPublisher],
})
export class CoreModule {}

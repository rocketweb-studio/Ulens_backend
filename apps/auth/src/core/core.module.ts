import { configModule } from "@auth/core/env-config/env-config.module";
import { Module } from "@nestjs/common";
import { CoreEnvConfig } from "@auth/core/core.config";
import { PrismaModule } from "@auth/core/prisma/prisma.module";
import { TestConsumer } from "./rabbit/test.consumer";

@Module({
	imports: [configModule, PrismaModule],
	controllers: [],
	providers: [CoreEnvConfig, TestConsumer],
	exports: [CoreEnvConfig],
})
export class CoreModule {}

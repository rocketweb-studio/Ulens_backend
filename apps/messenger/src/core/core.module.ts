import { configModule } from "@messenger/core/env-config/env-config.module";
import { Module } from "@nestjs/common";
import { CoreEnvConfig } from "@messenger/core/core.config";
import { PrismaModule } from "./prisma/prisma.module";
import { RabbitModule } from "@libs/rabbit/index";

@Module({
	imports: [configModule, PrismaModule, RabbitModule],
	controllers: [],
	providers: [CoreEnvConfig],
	exports: [CoreEnvConfig],
})
export class CoreModule {}

import { configModule } from "@notifications/core/env-config/env-config.module";
import { Module } from "@nestjs/common";
import { CoreEnvConfig } from "@notifications/core/core.config";
import { PrismaModule } from "./prisma/prisma.module";
import { RabbitModule } from "@libs/rabbit/index";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
	imports: [configModule, PrismaModule, RabbitModule, ScheduleModule.forRoot()],
	controllers: [],
	providers: [CoreEnvConfig],
	exports: [CoreEnvConfig],
})
export class CoreModule {}

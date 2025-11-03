import { configModule } from "@main/core/env-config/env-config.module";
import { Module } from "@nestjs/common";
import { CoreEnvConfig } from "@main/core/core.config";
import { PrismaModule } from "@main/core/prisma/prisma.module";
import { RabbitModule } from "@libs/rabbit/index";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
	imports: [configModule, PrismaModule, RabbitModule, ScheduleModule.forRoot()],
	controllers: [],
	providers: [CoreEnvConfig],
	exports: [CoreEnvConfig],
})
export class CoreModule {}

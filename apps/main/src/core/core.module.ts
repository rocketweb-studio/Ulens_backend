import { configModule } from "@main/core/env-config/env-config.module";
import { Module } from "@nestjs/common";
import { CoreEnvConfig } from "@main/core/core.config";
import { PrismaModule } from "@main/core/prisma/prisma.module";

@Module({
	imports: [configModule, PrismaModule],
	controllers: [],
	providers: [CoreEnvConfig],
	exports: [CoreEnvConfig],
})
export class CoreModule {}

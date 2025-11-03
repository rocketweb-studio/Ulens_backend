import { configModule } from "./env-config/env-config.module";
import { Module } from "@nestjs/common";
import { CoreEnvConfig } from "./core.config";
import { StorageModule } from "@files/core/storage/storage.module";
import { PrismaModule } from "@files/core/prisma/prisma.module";
import { RabbitModule } from "@libs/rabbit/index";
@Module({
	imports: [configModule, PrismaModule, StorageModule, RabbitModule],
	controllers: [],
	providers: [CoreEnvConfig],
	exports: [CoreEnvConfig], // Remove StorageService and StorageConfig from exports
})
export class CoreModule {}

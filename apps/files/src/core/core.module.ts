import { configModule } from "./env-config/env-config.module";
import { Module } from "@nestjs/common";
import { CoreEnvConfig } from "./core.config";
import { StorageModule } from "@files/core/storage/storage.module";

@Module({
	imports: [configModule, StorageModule],
	controllers: [],
	providers: [CoreEnvConfig],
	exports: [CoreEnvConfig], // Remove StorageService and StorageConfig from exports
})
export class CoreModule {}

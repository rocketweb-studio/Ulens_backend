import { Global, Module } from "@nestjs/common";
import { StorageConfig } from "@files/core/storage/storage.confg";
import { StorageService } from "@files/core/storage/storage.service";
import { StorageController } from "./storage.controller";

@Global()
@Module({
	providers: [StorageService, StorageConfig],
	controllers: [StorageController],
	exports: [StorageService],
})
export class StorageModule {}

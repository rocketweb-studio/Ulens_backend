import { Global, Module } from "@nestjs/common";
import { StorageConfig } from "@files/core/storage/storage.confg";
import { StorageService } from "@files/core/storage/storage.service";

@Global()
@Module({
	providers: [StorageService, StorageConfig],
	controllers: [],
	exports: [StorageService],
})
export class StorageModule {}

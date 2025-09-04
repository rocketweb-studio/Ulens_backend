import { Global, Module } from "@nestjs/common";
import { StorageConfig } from "@files/core/storage/storage.confg";
import { StorageAdapter } from "@files/core/storage/storage.adapter";

@Global()
@Module({
	providers: [StorageAdapter, StorageConfig],
	controllers: [],
	exports: [StorageAdapter],
})
export class StorageModule {}

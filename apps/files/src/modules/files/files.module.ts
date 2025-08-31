import { Module } from "@nestjs/common";
import { FilesController } from "./files.controller";
import { StorageModule } from "@files/core/storage/storage.module";
import { FilesConfig } from "./files.config";

@Module({
	imports: [StorageModule],
	providers: [FilesConfig],
	controllers: [FilesController],
	exports: [],
})
export class FilesModule {}

import { Module } from "@nestjs/common";
import { FilesController } from "./files.controller";
import { StorageModule } from "@files/core/storage/storage.module";

@Module({
	imports: [StorageModule],
	providers: [],
	controllers: [FilesController],
	exports: [],
})
export class FilesModule {}

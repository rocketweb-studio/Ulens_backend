import { Module } from "@nestjs/common";
import { FilesController } from "@files/modules/files/files.controller";
import { StorageModule } from "@files/core/storage/storage.module";
import { FilesConfig } from "@files/modules/files/files.config";
import { IFilesCommandRepository } from "@files/modules/files/files.interfaces";
import { PrismaFilesCommandRepository } from "@files/modules/files/repositories/files.command.repository";
import { FilesService } from "@files/modules/files/files.service";

@Module({
	imports: [StorageModule],
	providers: [FilesConfig, FilesService, { provide: IFilesCommandRepository, useClass: PrismaFilesCommandRepository }],
	controllers: [FilesController],
	exports: [],
})
export class FilesModule {}

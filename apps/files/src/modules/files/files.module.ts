import { Module } from "@nestjs/common";
import { FilesController } from "@files/modules/files/files.controller";
import { StorageModule } from "@files/core/storage/storage.module";
import { FilesConfig } from "@files/modules/files/files.config";
import { IFilesCommandRepository } from "@files/modules/files/files.interfaces";
import { PrismaFilesCommandRepository } from "@files/modules/files/repositories/files.command.repository";
import { FilesService } from "@files/modules/files/files.service";
import { IFilesQueryRepository } from "@files/modules/files/files.interfaces";
import { PrismaFilesQueryRepository } from "@files/modules/files/repositories/files.query.repository";

@Module({
	imports: [StorageModule],
	providers: [
		FilesConfig,
		FilesService,
		{ provide: IFilesCommandRepository, useClass: PrismaFilesCommandRepository },
		{ provide: IFilesQueryRepository, useClass: PrismaFilesQueryRepository },
	],
	controllers: [FilesController],
	exports: [],
})
export class FilesModule {}

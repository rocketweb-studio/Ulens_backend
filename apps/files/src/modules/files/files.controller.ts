import { Controller, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { StreamingServer } from "./streaming.server";
import { StorageService } from "@files/core/storage/storage.service";
import { FilesConfig } from "./files.config";

@Controller()
// Контроллер для файлового сервиса
export class FilesController implements OnModuleInit, OnModuleDestroy {
	private streamingServer: StreamingServer;

	constructor(
		private readonly storageService: StorageService,
		private readonly filesConfig: FilesConfig,
	) {}

	// Запускаем TCP сервер для streaming
	async onModuleInit() {
		// Запускаем TCP сервер для streaming
		// todo попробовать использовать DI
		this.streamingServer = new StreamingServer(this.storageService, this.filesConfig.streamingPort);
		await this.streamingServer.start();
	}

	// Останавливаем TCP сервер для streaming
	async onModuleDestroy() {
		if (this.streamingServer) {
			await this.streamingServer.stop();
		}
	}

	//! этот метод нужен только если у нас есть своя БД у файлового сервиса
	//! получается что если у нас нет свой БД то нам не нужно вообще TCP соединение у NestJs
	// @MessagePattern(FilesMessages.FILE_UPLOAD)
	// async initUpload(data: any) {
	// 	console.log(`Initializing upload ${data}`);

	// 	// await this.filesService.initUpload(data);

	// 	return {
	// 		success: true,
	// 		uploadId: 1
	// 	};
	// }
}

import { Controller, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { StreamingServer } from "@files/modules/files/streaming.server";
import { StorageAdapter } from "@files/core/storage/storage.adapter";
import { FilesConfig } from "@files/modules/files/files.config";
import { FilesMessages } from "@libs/constants/files-messages";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AvatarInputDto } from "@files/modules/files/dto/avatar.input.dto";
import { FilesService } from "@files/modules/files/files.service";
import { IFilesQueryRepository } from "./files.interfaces";
import { ImageOutputDto } from "@libs/contracts/index";

@Controller()
// Контроллер для файлового сервиса
export class FilesController implements OnModuleInit, OnModuleDestroy {
	private streamingServer: StreamingServer;

	constructor(
		private readonly storageService: StorageAdapter,
		private readonly filesConfig: FilesConfig,
		private readonly filesService: FilesService,
		private readonly filesQueryRepository: IFilesQueryRepository,
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

	@MessagePattern({ cmd: FilesMessages.AVATAR_UPLOAD })
	async saveAvatar(@Payload() data: AvatarInputDto): Promise<ImageOutputDto[]> {
		await this.filesService.saveAvatar(data);
		const newAvatars = await this.filesQueryRepository.findAvatarByUserId(data.userId);
		return newAvatars;
	}

	@MessagePattern({ cmd: FilesMessages.POST_IMAGES_UPLOAD })
	async savePostImages(@Payload() data: any): Promise<ImageOutputDto[]> {
		await this.filesService.savePostImages(data);
		const newPostImages = await this.filesQueryRepository.findPostImagesByPostId(data.postId);
		return newPostImages;
	}
}

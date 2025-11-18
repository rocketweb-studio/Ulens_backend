import { Injectable } from "@nestjs/common";
import { UploadFileOutputDto } from "@libs/contracts/files-contracts/output/upload-file.output.dto";
import { firstValueFrom } from "rxjs";
import { Microservice } from "@libs/constants/microservices";
import { Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { FilesMessages } from "@libs/constants/files-messages";
import { AvatarImagesOutputDto, MessageImgOutputDto, PostImagesOutputDto, PostImagesOutputForMapDto, UploadImageOutputDto } from "@libs/contracts/index";
import { StreamClientService } from "./stream-client.service";
import { FileUploadConfigs } from "./upload-config/file-upload-configs";
import { Request } from "express";

/**
 * *Сервис отвечает за загрузку файлов в файловый сервис по основному nestjs порту для работы с MessgePattern
 */
@Injectable()
export class FilesClientService {
	constructor(
		@Inject(Microservice.FILES) private readonly client: ClientProxy,
		private readonly streamClientService: StreamClientService,
	) {}

	async saveAvatarToDB(userId: string, uploadResult: UploadFileOutputDto): Promise<any> {
		const fileResult = await firstValueFrom(this.client.send({ cmd: FilesMessages.AVATAR_UPLOAD }, { userId, versions: uploadResult.versions }));
		return fileResult;
	}

	async savePostImagesToDB(postId: string, uploadResult: UploadFileOutputDto): Promise<PostImagesOutputDto> {
		const fileResult = await firstValueFrom(this.client.send({ cmd: FilesMessages.POST_IMAGES_UPLOAD }, { postId, versions: uploadResult.versions }));
		return fileResult;
	}

	async getAvatarsByUserId(userId: string): Promise<AvatarImagesOutputDto | null> {
		const avatars = await firstValueFrom(this.client.send({ cmd: FilesMessages.GET_USER_AVATARS }, userId));
		return avatars;
	}

	async getAvatarsByUserIds(userIds: string[]): Promise<{ userId: string; avatars: AvatarImagesOutputDto }[]> {
		const avatars = await firstValueFrom(this.client.send({ cmd: FilesMessages.GET_USER_AVATARS_BY_USER_IDS }, userIds));
		return avatars;
	}

	async getPostImages(postIds: string[]): Promise<PostImagesOutputForMapDto[]> {
		const images = await firstValueFrom(this.client.send({ cmd: FilesMessages.GET_POST_IMAGES }, postIds));
		return images;
	}

	async getMediasByMessageIds(messageIds: number[]): Promise<MessageImgOutputDto[]> {
		const media = await firstValueFrom(this.client.send({ cmd: FilesMessages.GET_MESSAGE_IMAGES_BY_MESSAGE_IDS }, messageIds));
		return media;
	}

	async deleteAvatarsByUserId(userId: string): Promise<void> {
		await firstValueFrom(this.client.send({ cmd: FilesMessages.DELETE_USER_AVATAR }, userId));
		return;
	}

	async updateMessageImages(messageId: number, imageIds: string[]): Promise<void> {
		await firstValueFrom(this.client.send({ cmd: FilesMessages.UPDATE_MESSAGE_IMAGES }, { messageId, imageIds }));
		return;
	}

	async uploadMessageImages(roomId: number, req: Request): Promise<UploadImageOutputDto> {
		const uploadResult = await this.streamClientService.streamFilesToService(req, FileUploadConfigs.MESSAGE_IMAGES);
		const dbResults = await Promise.all(uploadResult.files.map((file) => this.saveMessageImagesToDB(roomId, file)));
		return { files: dbResults.flat() };
	}

	async saveMessageImagesToDB(roomId: number, uploadResult: UploadFileOutputDto): Promise<MessageImgOutputDto[]> {
		const files: MessageImgOutputDto[] = await firstValueFrom(
			this.client.send({ cmd: FilesMessages.MESSAGE_IMAGES_UPLOAD }, { roomId, versions: uploadResult.versions }),
		);
		return files;
	}
}

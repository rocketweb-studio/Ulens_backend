import { FilesClientService } from "@gateway/microservices/files/files-client.service";
import { Inject, Injectable } from "@nestjs/common";
import { FileUploadConfigs } from "@gateway/microservices/files/upload-config/file-upload-configs";
import { BadRequestRpcException } from "@libs/exeption/rpc-exeption";
import { StreamClientService } from "@gateway/microservices/files/stream-client.service";
import { Request } from "express";
import { firstValueFrom } from "rxjs";
import { MainMessages, Microservice } from "@libs/constants/index";
import { ClientProxy } from "@nestjs/microservices";
import { CreatePostOutputDto, GetUserPostsQueryDto, UpdatePostDto } from "@libs/contracts/index";

@Injectable()
export class PostsClientService {
	constructor(
		private readonly streamClientService: StreamClientService,
		private readonly filesClientService: FilesClientService,
		@Inject(Microservice.MAIN) private readonly client: ClientProxy,
	) {}

	async uploadPostImages(postId: string, req: Request): Promise<any> {
		const uploadResult = await this.streamClientService.streamFilesToService(req, FileUploadConfigs.POST_IMAGES);

		if (!uploadResult.success) {
			throw new BadRequestRpcException(uploadResult.errors?.join(", ") || "Images upload failed");
		}

		// Сохраняем информацию о всех изображениях в БД
		const dbResults = await Promise.all(uploadResult.files.map((file) => this.filesClientService.savePostImagesToDB(postId, file)));

		return dbResults[0];
	}

	async createPost(userId: string, description: string): Promise<CreatePostOutputDto> {
		const result = await firstValueFrom(this.client.send({ cmd: MainMessages.CREATE_POST }, { userId, description }));
		return result;
	}

	async deletePost(userId: string, postId: string): Promise<boolean> {
		const result = await firstValueFrom(this.client.send({ cmd: MainMessages.DELETE_POST }, { userId, postId }));
		return result;
	}

	async updatePost(dto: UpdatePostDto): Promise<boolean> {
		const result = await firstValueFrom(this.client.send({ cmd: MainMessages.UPDATE_POST }, dto));
		return result;
	}

	async getUserPosts(userId: string, query: GetUserPostsQueryDto): Promise<any> {
		const result = await firstValueFrom(this.client.send({ cmd: MainMessages.GET_USER_POSTS }, { userId, ...query }));
		return result;
	}
}

import { FilesClientService } from "@gateway/microservices/files/files-client.service";
import { Inject, Injectable } from "@nestjs/common";
import { FileUploadConfigs } from "@gateway/microservices/files/upload-config/file-upload-configs";
import { BadRequestRpcException } from "@libs/exeption/rpc-exeption";
import { StreamClientService } from "@gateway/microservices/files/stream-client.service";
import { Request } from "express";
import { firstValueFrom } from "rxjs";
import { MainMessages, Microservice, AuthMessages, FilesMessages } from "@libs/constants/index";
import { ClientProxy } from "@nestjs/microservices";
import { CreatePostOutputDto, GetUserPostsQueryDto, PostImagesOutputDto, UpdatePostDto } from "@libs/contracts/index";
import { UserPostsPageDto } from "@libs/contracts/index";
import { toPostIdArray } from "@gateway/utils/mappers/to-postId-array";
import { mapToUserPostsOutput } from "@gateway/utils/mappers/to-user-posts-output.dto";
import { UserPostsOutputDto } from "@gateway/dto/user-posts-output.dto";

@Injectable()
export class PostsClientService {
	constructor(
		private readonly streamClientService: StreamClientService,
		private readonly filesClientService: FilesClientService,
		@Inject(Microservice.MAIN) private readonly mainClient: ClientProxy,
		@Inject(Microservice.AUTH) private readonly authClient: ClientProxy,
		@Inject(Microservice.FILES) private readonly filesClient: ClientProxy,
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
		const result = await firstValueFrom(this.mainClient.send({ cmd: MainMessages.CREATE_POST }, { userId, description }));
		return result;
	}

	async deletePost(userId: string, postId: string): Promise<boolean> {
		const result = await firstValueFrom(this.mainClient.send({ cmd: MainMessages.DELETE_POST }, { userId, postId }));
		return result;
	}

	async updatePost(dto: UpdatePostDto): Promise<boolean> {
		const result = await firstValueFrom(this.mainClient.send({ cmd: MainMessages.UPDATE_POST }, dto));
		return result;
	}

	async getUserPosts(userId: string, query: GetUserPostsQueryDto): Promise<UserPostsOutputDto> {
		// все независимые запросы
		const postsPromise = firstValueFrom(this.mainClient.send({ cmd: MainMessages.GET_USER_POSTS }, { userId, ...query }));
		const profilePromise = firstValueFrom(this.authClient.send({ cmd: AuthMessages.GET_PROFILE_FOR_POSTS }, userId));
		const avatarPromise = firstValueFrom(this.filesClient.send({ cmd: FilesMessages.GET_USER_AVATAR_URL }, userId));

		// ждем только посты, чтобы получить postId[]
		const posts: UserPostsPageDto = await postsPromise;
		const postIds = toPostIdArray(posts);

		// картинки: если постов нет - сразу пустой массив
		const imagesPromise = postIds.length
			? firstValueFrom(this.filesClient.send({ cmd: FilesMessages.GET_USER_POST_IMAGES }, postIds))
			: Promise.resolve([] as PostImagesOutputDto[]);

		// остальное дожидаемся параллельно
		const [profile, avatar, images] = await Promise.all([profilePromise, avatarPromise, imagesPromise]);

		return mapToUserPostsOutput(posts, profile, avatar, userId, images);
	}
}

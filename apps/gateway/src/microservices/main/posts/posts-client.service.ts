import { FilesClientService } from "@gateway/microservices/files/files-client.service";
import { Inject, Injectable } from "@nestjs/common";
import { FileUploadConfigs } from "@gateway/microservices/files/upload-config/file-upload-configs";
import { BadRequestRpcException } from "@libs/exeption/rpc-exeption";
import { StreamClientService } from "@gateway/microservices/files/stream-client.service";
import { Request } from "express";
import { firstValueFrom } from "rxjs";
import { MainMessages, Microservice } from "@libs/constants/index";
import { ClientProxy } from "@nestjs/microservices";
import {
	CreatePostOutputDto,
	GetUserPostsQueryDto,
	PostDbOutputDto,
	PostImagesOutputDto,
	ProfileOutputWithAvatarDto,
	UpdatePostDto,
} from "@libs/contracts/index";
import { UserPostsPageDto } from "@libs/contracts/index";
import { toPostIdArray } from "@gateway/utils/mappers/to-postId-array";
import { mapToUserPostsOutput } from "@gateway/utils/mappers/to-user-posts-output.dto";
import { PostOutputDto, UserPostsOutputDto } from "@libs/contracts/main-contracts/output/user-posts-output.dto";
import { ProfileAuthClientService } from "@gateway/microservices/auth/profile/profile-auth-clien.service";

@Injectable()
export class PostsClientService {
	constructor(
		private readonly streamClientService: StreamClientService,
		private readonly filesClientService: FilesClientService,
		@Inject(Microservice.MAIN) private readonly mainClient: ClientProxy,
		private readonly profileClientService: ProfileAuthClientService,
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
		const posts: UserPostsPageDto = await firstValueFrom(this.mainClient.send({ cmd: MainMessages.GET_USER_POSTS }, { userId, ...query }));
		const profile: ProfileOutputWithAvatarDto = await this.profileClientService.getProfile(userId);
		const postIds = toPostIdArray(posts);

		const postsImages: PostImagesOutputDto[] = await this.filesClientService.getPostImages(postIds);

		return mapToUserPostsOutput(posts, profile, postsImages);
	}

	async getPost(postId: string): Promise<PostOutputDto> {
		const post = await firstValueFrom(this.mainClient.send({ cmd: MainMessages.GET_POST }, { postId }));
		const profile: ProfileOutputWithAvatarDto = await this.profileClientService.getProfile(post.userId);
		const postsImages: PostImagesOutputDto[] = await this.filesClientService.getPostImages([postId]);

		return this.buildPostOutput(post, profile, postsImages);
	}

	private buildPostOutput(post: PostDbOutputDto, profile: ProfileOutputWithAvatarDto, postImages: PostImagesOutputDto[]): PostOutputDto {
		return {
			id: post.id,
			userName: profile.userName,
			description: post.description,
			location: {
				city: profile.city,
				country: profile.country,
				region: profile.region,
			},
			images: (postImages ?? []).map((img) => ({
				url: img.url,
				width: img.width,
				height: img.height,
				fileSize: img.fileSize,
				size: img.size,
				// нормализация в string
				createdAt: typeof img.createdAt === "string" ? img.createdAt : img.createdAt.toISOString(),
				uploadId: img.id,
			})),
			createdAt: post.createdAt.toString(), //  ISO
			updatedAt: post.updatedAt.toString(), //  ISO
			ownerId: profile.id,
			avatarOwner: profile.avatars.find((avatar) => avatar.width === 45)?.url ?? null,
			owner: {
				firstName: profile.firstName,
				lastName: profile.lastName,
			},
			likeCount: 0,
			isLiked: false,
			avatarWhoLikes: false,
		};
	}
}

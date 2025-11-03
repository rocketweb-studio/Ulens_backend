import { FilesClientService } from "@gateway/microservices/files/files-client.service";
import { Inject, Injectable } from "@nestjs/common";
import { FileUploadConfigs } from "@gateway/microservices/files/upload-config/file-upload-configs";
import { BadRequestRpcException, NotFoundRpcException } from "@libs/exeption/rpc-exeption";
import { StreamClientService } from "@gateway/microservices/files/stream-client.service";
import { Request } from "express";
import { firstValueFrom } from "rxjs";
import { GraphqlPubSubMessages, MainMessages, Microservice, PUB_SUB_GQL } from "@libs/constants/index";
import { ClientProxy } from "@nestjs/microservices";
import {
	CreatePostOutputDto,
	GetUserPostsQueryDto,
	PostDbOutputDto,
	PostImagesOutputForMapDto,
	ProfileOutputWithAvatarDto,
	UpdatePostDto,
} from "@libs/contracts/index";
import { UserPostsPageDto } from "@libs/contracts/index";
import { toPostIdArray } from "@gateway/utils/mappers/to-postId-array";
// import { mapToUserPostsOutput } from "@gateway/utils/mappers/to-user-posts-output.dto";
import { PostOutputDto, UserPostsOutputDto } from "@libs/contracts/main-contracts/output/user-posts-output.dto";
import { ProfileAuthClientService } from "@gateway/microservices/auth/profile/profile-auth-clien.service";
import { GetAdminPostsInput, GetAdminPostsInputWithUserIds } from "../posts_gql/inputs/get-admin-posts.input";
import { RedisPubSub } from "graphql-redis-subscriptions";

@Injectable()
export class PostsClientService {
	constructor(
		private readonly streamClientService: StreamClientService,
		private readonly filesClientService: FilesClientService,
		@Inject(Microservice.MAIN) private readonly mainClient: ClientProxy,
		private readonly profileClientService: ProfileAuthClientService,
		@Inject(PUB_SUB_GQL) private readonly pubSub: RedisPubSub,
	) {}

	async uploadPostImages(postId: string, req: Request): Promise<any> {
		const postImagesIsExists = await this.filesClientService.getPostImages([postId]);
		if (postImagesIsExists.length > 0) {
			throw new BadRequestRpcException("Images already uploaded for this post");
		}
		const uploadResult = await this.streamClientService.streamFilesToService(req, FileUploadConfigs.POST_IMAGES);

		if (!uploadResult.success) {
			throw new BadRequestRpcException(uploadResult.errors?.join(", ") || "Images upload failed");
		}

		// Сохраняем информацию о всех изображениях в БД // todo ===========start=========== сделать это в микросервисе
		const dbResults = await Promise.all(uploadResult.files.map((file) => this.filesClientService.savePostImagesToDB(postId, file)));
		// todo ===========end===========
		const post = await this.getPost(postId);
		await this.pubSub.publish(GraphqlPubSubMessages.NEW_POST_ADDED, { newPostAdded: post });
		return dbResults[dbResults.length - 1];
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

		const postsImages: PostImagesOutputForMapDto[] = await this.filesClientService.getPostImages(postIds);

		return {
			totalCount: posts.totalCount,
			pageSize: posts.pageSize,
			items: posts.items.map((post) =>
				this.buildPostOutput(
					post,
					profile,
					postsImages.filter((img) => img.parentId === post.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
				),
			),
			pageInfo: {
				endCursorPostId: posts.pageInfo.endCursorPostId,
				hasNextPage: posts.pageInfo.hasNextPage,
			},
		};

		// return mapToUserPostsOutput(posts, profile, postsImages);
	}

	async getAllPostsForAdmin(input: GetAdminPostsInput): Promise<UserPostsPageDto> {
		const posts: UserPostsPageDto = await firstValueFrom(this.mainClient.send({ cmd: MainMessages.GET_ALL_POSTS_FOR_ADMIN }, input));
		return posts;
	}

	async getAllPostsForAdminByUserIds(input: GetAdminPostsInputWithUserIds): Promise<UserPostsPageDto> {
		const posts: UserPostsPageDto = await firstValueFrom(this.mainClient.send({ cmd: MainMessages.GET_ALL_POSTS_FOR_ADMIN_BY_USER_IDS }, input));
		return posts;
	}

	async getPost(postId: string): Promise<PostOutputDto> {
		const post = await firstValueFrom(this.mainClient.send({ cmd: MainMessages.GET_POST }, { postId }));
		const profile: ProfileOutputWithAvatarDto = await this.profileClientService.getProfile(post.userId);
		const postsImages: PostImagesOutputForMapDto[] = await this.filesClientService.getPostImages([postId]);

		return this.buildPostOutput(post, profile, postsImages);
	}

	async getLatestPosts(): Promise<PostOutputDto[]> {
		const posts: PostDbOutputDto[] = await firstValueFrom(this.mainClient.send({ cmd: MainMessages.GET_LATEST_POSTS }, { pageSize: 5 }));

		const profiles = await Promise.all(posts.map((post) => this.profileClientService.getProfile(post.userId)));
		const postIds = posts.map((post) => post.id);
		const postsImages = await this.filesClientService.getPostImages(postIds);

		return posts.map((post) => {
			const profile = profiles.find((p) => p.id === post.userId);
			if (!profile) {
				throw new NotFoundRpcException(`Profile not found for user ${post.userId}`);
			}
			return this.buildPostOutput(
				post,
				profile,
				postsImages.filter((img) => img.parentId === post.id),
			);
		});
	}

	private buildPostOutput(post: PostDbOutputDto, profile: ProfileOutputWithAvatarDto, postImages: PostImagesOutputForMapDto[]): PostOutputDto {
		return {
			id: post.id,
			userName: profile.userName,
			description: post.description,
			location: {
				city: profile.city,
				country: profile.country,
			},
			images: {
				small: postImages
					.filter((img) => img.size === "small")
					.map((img) => ({
						url: img.url,
						width: img.width,
						height: img.height,
						fileSize: img.fileSize,
						createdAt: img.createdAt,
						uploadId: img.id,
					}))
					.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
				medium: postImages
					.filter((img) => img.size === "medium")
					.map((img) => ({
						url: img.url,
						width: img.width,
						height: img.height,
						fileSize: img.fileSize,
						createdAt: img.createdAt,
						uploadId: img.id,
					}))
					.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
			},
			createdAt: post.createdAt.toString(), //  ISO
			updatedAt: post.updatedAt.toString(), //  ISO
			ownerId: profile.id,
			avatarOwner: profile.avatars.small?.url || null,
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

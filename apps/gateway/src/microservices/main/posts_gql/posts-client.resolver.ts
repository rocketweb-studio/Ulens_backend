import { Args, Query, Resolver, Subscription } from "@nestjs/graphql";
import { GqlJwtAuthGuard } from "@gateway/core/guards/gql-jwt-auth.guard";
import { Inject, UseGuards } from "@nestjs/common";
import { GetAdminPostsInput } from "@gateway/microservices/main/posts_gql/inputs/get-admin-posts.input";
import { ProfileAuthClientService } from "@gateway/microservices/auth/profile/profile-auth-clien.service";
import { FilesClientService } from "@gateway/microservices/files/files-client.service";
import { PostsResponse } from "@gateway/microservices/main/posts_gql/models/post.model";
import { UserPostsPageDto } from "@libs/contracts/main-contracts/output/get-user-posts-output.dto";
import { PostImagesOutputForMapDto } from "@libs/contracts/files-contracts/output/post-images-for-map.output.dto";
import { PostsClientService } from "@gateway/microservices/main/posts/posts-client.service";
import { ProfileOutputForMapDto } from "@libs/contracts/auth-contracts/output/profile.output.dto";
import { AvatarImagesOutputDto } from "@libs/contracts/files-contracts/output/avatar-images.output.dto";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { GraphqlPubSubMessages, PUB_SUB_GQL } from "@libs/constants/index";
import { PostModel } from "@gateway/microservices/main/posts_gql/models/post.model";

@Resolver("Posts")
export class PostsClientResolver {
	constructor(
		private readonly filesClientService: FilesClientService,
		private readonly profileClientService: ProfileAuthClientService,
		private readonly postsClientService: PostsClientService,
		@Inject(PUB_SUB_GQL) private readonly pubSub: RedisPubSub,
	) {}

	@UseGuards(GqlJwtAuthGuard)
	@Query(() => PostsResponse, { name: "getAllPostsForAdmin" })
	async getAllPostsForAdmin(@Args("input") input: GetAdminPostsInput): Promise<PostsResponse> {
		if (input.search) {
			return this.getAllPostsForAdminWithSearch(input);
		}
		return this.getAllPostsForAdminWithoutSearch(input);
	}

	@Subscription(() => PostModel, { name: "newPostAdded" })
	newPostAdded() {
		return this.pubSub.asyncIterator(GraphqlPubSubMessages.NEW_POST_ADDED);
	}

	private async getAllPostsForAdminWithoutSearch(input: GetAdminPostsInput): Promise<PostsResponse> {
		const posts: UserPostsPageDto = await this.postsClientService.getAllPostsForAdmin(input);
		const postIds = posts.items.map((post) => post.id);
		const postProfilesIds = [...new Set(posts.items.map((post) => post.userId))];
		const postsImages: PostImagesOutputForMapDto[] = await this.filesClientService.getPostImages(postIds);
		const profiles: ProfileOutputForMapDto[] = await this.profileClientService.getProfiles(postProfilesIds);
		const profilesAvatars: { userId: string; avatars: AvatarImagesOutputDto }[] = await this.filesClientService.getAvatarsByUserIds(postProfilesIds);

		// Create a Map for O(1) lookup
		const profilesMap = new Map(profiles.map((profile) => [profile.id, profile]));

		return {
			totalCount: posts.totalCount,
			pageSize: posts.pageSize,
			pageInfo: {
				endCursorPostId: posts.pageInfo.endCursorPostId,
				hasNextPage: posts.pageInfo.hasNextPage,
			},
			items: posts.items.map((post) => {
				const profile = profilesMap.get(post.userId);
				return {
					id: post.id,
					ownerId: post.userId,
					userName: profile?.userName ?? "",
					description: post.description,
					createdAt: post.createdAt.toString(),
					updatedAt: post.updatedAt.toString(),
					images: {
						small: postsImages
							.filter((img) => img.parentId === post.id && img.size === "small")
							.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
							.map((img) => ({
								url: img.url,
								width: img.width,
								height: img.height,
								fileSize: img.fileSize,
								createdAt: img.createdAt.toString(),
							})),
						medium: postsImages
							.filter((img) => img.parentId === post.id && img.size === "medium")
							.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
							.map((img) => ({
								url: img.url,
								width: img.width,
								height: img.height,
								fileSize: img.fileSize,
								createdAt: img.createdAt.toString(),
							})),
					},
					avatarOwner: profilesAvatars.find((avatar) => avatar.userId === post.userId)?.avatars.small?.url || null,
					owner: {
						firstName: profile?.firstName ?? null,
						lastName: profile?.lastName ?? null,
					},
					likeCount: 0,
					isLiked: false,
					avatarWhoLikes: false,
					isOwnerBlocked: profile?.isBlocked ?? false,
				};
			}),
		};
	}

	private async getAllPostsForAdminWithSearch(input: GetAdminPostsInput): Promise<PostsResponse> {
		const matchedProfiles = await this.profileClientService.getProfilesByUserName(input.search);
		const userIds = matchedProfiles.map((profile) => profile.id);
		const posts: UserPostsPageDto = await this.postsClientService.getAllPostsForAdminByUserIds({ ...input, userIds });
		const postIds = posts.items.map((post) => post.id);
		const postsImages: PostImagesOutputForMapDto[] = await this.filesClientService.getPostImages(postIds);
		const profilesAvatars: { userId: string; avatars: AvatarImagesOutputDto }[] = await this.filesClientService.getAvatarsByUserIds(userIds);

		// Create a Map for O(1) lookup
		const profilesMap = new Map(matchedProfiles.map((profile) => [profile.id, profile]));

		return {
			totalCount: posts.totalCount,
			pageSize: posts.pageSize,
			pageInfo: {
				endCursorPostId: posts.pageInfo.endCursorPostId,
				hasNextPage: posts.pageInfo.hasNextPage,
			},
			items: posts.items.map((post) => {
				const profile = profilesMap.get(post.userId);
				return {
					id: post.id,
					ownerId: post.userId,
					userName: profile?.userName ?? "",
					description: post.description,
					createdAt: post.createdAt.toString(),
					updatedAt: post.updatedAt.toString(),
					images: {
						small: postsImages
							.filter((img) => img.parentId === post.id && img.size === "small")
							.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
							.map((img) => ({
								url: img.url,
								width: img.width,
								height: img.height,
								fileSize: img.fileSize,
								createdAt: img.createdAt.toString(),
							})),
						medium: postsImages
							.filter((img) => img.parentId === post.id && img.size === "medium")
							.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
							.map((img) => ({
								url: img.url,
								width: img.width,
								height: img.height,
								fileSize: img.fileSize,
								createdAt: img.createdAt.toString(),
							})),
					},
					avatarOwner: profilesAvatars.find((avatar) => avatar.userId === post.userId)?.avatars.small?.url || null,
					owner: {
						firstName: profile?.firstName || null,
						lastName: profile?.lastName || null,
					},
					likeCount: 0,
					isLiked: false,
					avatarWhoLikes: false,
					isOwnerBlocked: profile?.isBlocked ?? false,
				};
			}),
		};
	}
}

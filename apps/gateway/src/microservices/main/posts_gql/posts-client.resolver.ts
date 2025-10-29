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
import { ProfileOutputDto } from "@libs/contracts/auth-contracts/output/profile.output.dto";
import { AvatarImagesOutputDto } from "@libs/contracts/files-contracts/output/avatar-images.output.dto";
import { PubSub } from "graphql-subscriptions";
import { GraphqlPubSubMessages, PUB_SUB_GQL } from "@libs/constants/index";
import { PostModel } from "@gateway/microservices/main/posts_gql/models/post.model";

@Resolver("Posts")
export class PostsClientResolver {
	constructor(
		private readonly filesClientService: FilesClientService,
		private readonly profileClientService: ProfileAuthClientService,
		private readonly postsClientService: PostsClientService,
		@Inject(PUB_SUB_GQL) private readonly pubSub: PubSub,
	) {}

	@UseGuards(GqlJwtAuthGuard)
	@Query(() => PostsResponse, { name: "getAllPostsForAdmin" })
	async getAllPostsForAdmin(@Args("input") input: GetAdminPostsInput) {
		const posts: UserPostsPageDto = await this.postsClientService.getAllPostsForAdmin(input);
		const postIds = posts.items.map((post) => post.id);
		const postProfilesIds = [...new Set(posts.items.map((post) => post.userId))];
		const postsImages: PostImagesOutputForMapDto[] = await this.filesClientService.getPostImages(postIds);
		const profiles: ProfileOutputDto[] = await this.profileClientService.getProfiles(postProfilesIds);
		const profilesAvatars: { userId: string; avatars: AvatarImagesOutputDto }[] = await this.filesClientService.getAvatarsByUserIds(postProfilesIds);

		return {
			totalCount: posts.totalCount,
			pageSize: posts.pageSize,
			pageInfo: {
				endCursorPostId: posts.pageInfo.endCursorPostId,
				hasNextPage: posts.pageInfo.hasNextPage,
			},
			items: posts.items.map((post) => ({
				id: post.id,
				ownerId: post.userId,
				userName: profiles.find((profile) => profile.id === post.userId)?.userName,
				description: post.description,
				createdAt: post.createdAt.toString(),
				updatedAt: post.updatedAt.toString(),
				images: {
					small: postsImages
						.filter((img) => img.parentId === post.id && img.size === "small")
						.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
					medium: postsImages
						.filter((img) => img.parentId === post.id && img.size === "medium")
						.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
				},
				avatarOwner: profilesAvatars.find((avatar) => avatar.userId === post.userId)?.avatars.small?.url,
				owner: {
					firstName: profiles.find((profile) => profile.id === post.userId)?.firstName,
					lastName: profiles.find((profile) => profile.id === post.userId)?.lastName,
				},
				likeCount: 0,
				isLiked: false,
				avatarWhoLikes: false,
			})),
		};
	}

	@Subscription(() => PostModel, { name: "newPostAdded" })
	newPostAdded() {
		return this.pubSub.asyncIterableIterator(GraphqlPubSubMessages.NEW_POST_ADDED);
	}
}

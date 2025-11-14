/**
 *Using abstract classes lets Nest use the class itself as the DI token,
 *   so your service can inject by type without @Inject()
 */

import { CreatePostOutputDto, GetFollowingsPostsQueryDto, PostDbOutputDto, UpdatePostDto } from "@libs/contracts/index";
import { CreatePostWithUserIdDto } from "@main/modules/post/dto/create-post.userId.input.dto";
import { GetUserPostsInputDto } from "@main/modules/post/dto/get-user-posts.input.dto";
import { UserPostsPageDto } from "@libs/contracts/index";

export abstract class IPostQueryRepository {
	abstract getUserPosts(dto: GetUserPostsInputDto): Promise<UserPostsPageDto>;
	abstract getPostById(id: string, authorizedCurrentUserId?: string | null): Promise<PostDbOutputDto | null>;
	abstract getUserPostsCount(userId: string): Promise<number>;
	abstract getLatestPosts(pageSize: number, authorizedCurrentUserId?: string | null): Promise<PostDbOutputDto[]>;
	abstract getAllPostsForAdmin(dto: { endCursorPostId: string; pageSize: number; search: string }): Promise<UserPostsPageDto>;
	abstract getAllPostsForAdminByUserIds(dto: { endCursorPostId: string; pageSize: number; userIds: string[] }): Promise<UserPostsPageDto>;
	abstract getFollowingsPosts(followingsIds: string[], query: GetFollowingsPostsQueryDto, authorizedCurrentUserId: string): Promise<UserPostsPageDto>;
}

export abstract class IPostCommandRepository {
	abstract createPost(dto: CreatePostWithUserIdDto): Promise<CreatePostOutputDto>;
	abstract getPostById(id: string): Promise<PostDbOutputDto | null>;
	abstract deletePost(id: string): Promise<boolean>;
	abstract updatePost(dto: UpdatePostDto): Promise<boolean>;
	abstract deleteDeletedPosts(): Promise<void>;
	abstract softDeleteUserPosts(userId: string): Promise<boolean>;
}

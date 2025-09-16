/**
 *Using abstract classes lets Nest use the class itself as the DI token,
 *   so your service can inject by type without @Inject()
 */

import { CreatePostOutputDto, PostDbOutputDto, UpdatePostDto } from "@libs/contracts/index";
import { CreatePostWithUserIdDto } from "./dto/create-post.userId.input.dto";
import { GetUserPostsInputDto } from "./dto/get-user-posts.input.dto";
import { UserPostsPageDto } from "@libs/contracts/index";

export abstract class IPostQueryRepository {
	abstract getUserPosts(dto: GetUserPostsInputDto): Promise<UserPostsPageDto>;
	abstract getPostById(id: string): Promise<PostDbOutputDto | null>;
}

export abstract class IPostCommandRepository {
	abstract createPost(dto: CreatePostWithUserIdDto): Promise<CreatePostOutputDto>;
	abstract getPostById(id: string): Promise<PostDbOutputDto | null>;
	abstract deletePost(id: string): Promise<boolean>;
	abstract updatePost(dto: UpdatePostDto): Promise<boolean>;
}

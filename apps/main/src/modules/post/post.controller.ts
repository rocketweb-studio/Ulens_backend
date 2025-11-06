import { Controller } from "@nestjs/common";
import { PostService } from "@main/modules/post/post.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MainMessages } from "@libs/constants/index";
import { CreatePostWithUserIdDto } from "@main/modules/post/dto/create-post.userId.input.dto";
import { CreatePostOutputDto, GetFollowingsPostsQueryDto, PostDbOutputDto, UpdatePostDto } from "@libs/contracts/index";
import { DeletePostDto } from "@main/modules/post/dto/delete-post.input.dto";
import { GetUserPostsInputDto } from "@main/modules/post/dto/get-user-posts.input.dto";
import { IPostQueryRepository } from "@main/modules/post/post.interface";
import { UserPostsPageDto } from "@libs/contracts/index";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";

@Controller()
export class PostController {
	constructor(
		private readonly postService: PostService,
		private readonly postQueryRepository: IPostQueryRepository,
	) {}

	@MessagePattern({ cmd: MainMessages.CREATE_POST })
	async createPost(@Payload() dto: CreatePostWithUserIdDto): Promise<CreatePostOutputDto> {
		return this.postService.createPost(dto);
	}

	@MessagePattern({ cmd: MainMessages.DELETE_POST })
	async deletePost(@Payload() dto: DeletePostDto): Promise<boolean> {
		return this.postService.deletePost(dto);
	}

	@MessagePattern({ cmd: MainMessages.UPDATE_POST })
	async updatePost(@Payload() dto: UpdatePostDto): Promise<boolean> {
		return this.postService.updatePost(dto);
	}

	@MessagePattern({ cmd: MainMessages.GET_USER_POSTS })
	async getUserPosts(@Payload() dto: GetUserPostsInputDto): Promise<UserPostsPageDto> {
		return this.postQueryRepository.getUserPosts(dto);
	}

	@MessagePattern({ cmd: MainMessages.GET_USER_POSTS_COUNT })
	async getUserPostsCount(@Payload() dto: { userId: string }): Promise<number> {
		return this.postQueryRepository.getUserPostsCount(dto.userId);
	}

	@MessagePattern({ cmd: MainMessages.GET_POST })
	async getPost(@Payload() dto: { postId: string }): Promise<PostDbOutputDto> {
		const post = await this.postQueryRepository.getPostById(dto.postId);
		if (!post) throw new NotFoundRpcException("Post not found");
		return post;
	}

	@MessagePattern({ cmd: MainMessages.GET_LATEST_POSTS })
	async getLatestPosts(@Payload() dto: { pageSize: number }): Promise<PostDbOutputDto[]> {
		return this.postQueryRepository.getLatestPosts(dto.pageSize);
	}

	@MessagePattern({ cmd: MainMessages.GET_ALL_POSTS_FOR_ADMIN })
	async getAllPostsForAdmin(@Payload() dto: { endCursorPostId: string; pageSize: number; search: string }): Promise<UserPostsPageDto> {
		return this.postQueryRepository.getAllPostsForAdmin(dto);
	}

	@MessagePattern({ cmd: MainMessages.GET_ALL_POSTS_FOR_ADMIN_BY_USER_IDS })
	async getAllPostsForAdminByUserIds(@Payload() dto: { endCursorPostId: string; pageSize: number; userIds: string[] }): Promise<UserPostsPageDto> {
		return this.postQueryRepository.getAllPostsForAdminByUserIds(dto);
	}

	@MessagePattern({ cmd: MainMessages.GET_FOLLOWINGS_POSTS })
	async getFollowingsPosts(@Payload() dto: { followingsIds: string[]; query: GetFollowingsPostsQueryDto }): Promise<UserPostsPageDto> {
		return this.postQueryRepository.getFollowingsPosts(dto.followingsIds, dto.query);
	}
}

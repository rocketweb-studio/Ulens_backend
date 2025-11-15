import { Controller } from "@nestjs/common";
import { PostService } from "@main/modules/post/post.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MainMessages } from "@libs/constants/index";
import { CreatePostWithUserIdDto } from "@main/modules/post/dto/create-post.userId.input.dto";
import { CreatePostOutputDto, GetFollowingsPostsQueryDto, LikedItemType, PostDbOutputDto, UpdatePostDto } from "@libs/contracts/index";
import { DeletePostDto } from "@main/modules/post/dto/delete-post.input.dto";
import { GetUserPostsInputDto } from "@main/modules/post/dto/get-user-posts.input.dto";
import { IPostQueryRepository } from "@main/modules/post/post.interface";
import { UserPostsPageDto } from "@libs/contracts/index";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";
import { CreatePostCommentInputDto } from "@main/modules/post/dto/create-post-comment.input.dto";
import { ICommentQueryRepository } from "@main/modules/comment/comment.interface";
import { CreateCommentDbOutputDto } from "@main/modules/comment/dto/create-comment-db.output.dto";
import { LikeService } from "@main/modules/like/like.service";
import { LikeInputDto } from "../like/dto/like.input.dto";

@Controller()
export class PostController {
	constructor(
		private readonly postService: PostService,
		private readonly postQueryRepository: IPostQueryRepository,
		private readonly commentQueryRepository: ICommentQueryRepository,
		private readonly likeService: LikeService,
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

	//!
	@MessagePattern({ cmd: MainMessages.GET_USER_POSTS })
	async getUserPosts(@Payload() dto: GetUserPostsInputDto): Promise<UserPostsPageDto> {
		return this.postQueryRepository.getUserPosts(dto);
	}

	@MessagePattern({ cmd: MainMessages.GET_USER_POSTS_COUNT })
	async getUserPostsCount(@Payload() dto: { userId: string }): Promise<number> {
		return this.postQueryRepository.getUserPostsCount(dto.userId);
	}
	//!
	@MessagePattern({ cmd: MainMessages.GET_POST })
	async getPost(@Payload() dto: { postId: string; authorizedCurrentUserId?: string | null }): Promise<PostDbOutputDto> {
		const post = await this.postQueryRepository.getPostById(dto.postId, dto.authorizedCurrentUserId);
		if (!post) throw new NotFoundRpcException("Post not found");
		return post;
	}
	//!
	@MessagePattern({ cmd: MainMessages.GET_LATEST_POSTS })
	async getLatestPosts(@Payload() dto: { pageSize: number; authorizedCurrentUserId?: string | null }): Promise<PostDbOutputDto[]> {
		return this.postQueryRepository.getLatestPosts(dto.pageSize, dto.authorizedCurrentUserId);
	}

	@MessagePattern({ cmd: MainMessages.GET_ALL_POSTS_FOR_ADMIN })
	async getAllPostsForAdmin(@Payload() dto: { endCursorPostId: string; pageSize: number; search: string }): Promise<UserPostsPageDto> {
		return this.postQueryRepository.getAllPostsForAdmin(dto);
	}

	@MessagePattern({ cmd: MainMessages.GET_ALL_POSTS_FOR_ADMIN_BY_USER_IDS })
	async getAllPostsForAdminByUserIds(@Payload() dto: { endCursorPostId: string; pageSize: number; userIds: string[] }): Promise<UserPostsPageDto> {
		return this.postQueryRepository.getAllPostsForAdminByUserIds(dto);
	}
	//!
	@MessagePattern({ cmd: MainMessages.GET_FOLLOWINGS_POSTS })
	async getFollowingsPosts(
		@Payload() dto: { followingsIds: string[]; query: GetFollowingsPostsQueryDto; authorizedCurrentUserId: string },
	): Promise<UserPostsPageDto> {
		return this.postQueryRepository.getFollowingsPosts(dto.followingsIds, dto.query, dto.authorizedCurrentUserId);
	}

	@MessagePattern({ cmd: MainMessages.CREATE_POST_COMMENT })
	async createPostComment(@Payload() dto: CreatePostCommentInputDto): Promise<CreateCommentDbOutputDto> {
		const commentId = await this.postService.createPostComment(dto);
		const comment = await this.commentQueryRepository.getCommentById(commentId);
		if (!comment) throw new NotFoundRpcException("Comment not found");
		return comment;
	}

	@MessagePattern({ cmd: MainMessages.GET_POST_COMMENTS })
	async getPostComments(
		@Payload() dto: { userId: string | null; postId: string },
	): Promise<CreateCommentDbOutputDto & { likeCount: number; isLiked: boolean }[]> {
		return this.commentQueryRepository.getPostComments(dto.userId, dto.postId);
	}

	@MessagePattern({ cmd: MainMessages.GET_POSTS_COMMENTS_COUNT })
	async getPostsCommentsCount(@Payload() dto: { postIds: string[] }): Promise<{ postId: string; commentsCount: number }[]> {
		return this.commentQueryRepository.getPostsCommentsCount(dto.postIds);
	}

	@MessagePattern({ cmd: MainMessages.LIKE_POST_OR_COMMENT })
	async likePostOrComment(@Payload() dto: LikeInputDto): Promise<{ success: boolean }> {
		if (dto.likedItemType === LikedItemType.POST) {
			const post = await this.postQueryRepository.getPostById(dto.likedItemId);
			if (!post) throw new NotFoundRpcException("Post not found");
		} else if (dto.likedItemType === LikedItemType.COMMENT) {
			const comment = await this.commentQueryRepository.getCommentById(dto.likedItemId);
			if (!comment) throw new NotFoundRpcException("Comment not found");
		}
		await this.likeService.likePostOrComment(dto);
		return {
			success: true,
		};
	}
}

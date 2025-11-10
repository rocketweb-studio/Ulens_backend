import { JwtAccessAuthGuard } from "@gateway/core/guards/jwt-access-auth.guard";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { PostsClientService } from "./posts-client.service";
import { StreamingFileInterceptor } from "@gateway/core/interceptors/streaming-file.interceptor";
import { UploadPostImagesSwagger } from "@gateway/core/decorators/swagger/post/upload-post-images.decorator";
import { ApiTagsNames, MainRouterPaths, RouteParams } from "@libs/constants/index";
import { Request } from "express";
import {
	CommentOutputDto,
	CreateCommentInputDto,
	CreatePostDto,
	CreatePostOutputDto,
	GetFollowingsPostsQueryDto,
	GetUserPostsQueryDto,
	PayloadFromRequestDto,
	PostIdParamDto,
	UserIdParamDto,
} from "@libs/contracts/index";
import { ExtractUserFromRequest } from "@gateway/core/decorators/param/extract-user-from-request";
import { CreatePostSwagger } from "@gateway/core/decorators/swagger/main/create-post-swagger.decorator";
import { DeletePostSwagger } from "@gateway/core/decorators/swagger/main/delete-post-swagger.decorator";
import { UpdatePostSwagger } from "@gateway/core/decorators/swagger/main/update-post-swagger.decorator";
import { GetUserPostsSwagger } from "@gateway/core/decorators/swagger/main/get-user-posts-swagger.decorator";
import { PostOutputDto, UserPostsOutputDto } from "@libs/contracts/main-contracts/output/user-posts-output.dto";
import { ApiTags } from "@nestjs/swagger";
import { GetPostSwagger } from "@gateway/core/decorators/swagger/main/get-post.decorator";
import { GetLatestPostsSwagger } from "@gateway/core/decorators/swagger/main/get-latest-posts.decorator";
import { JwtAccessCheckGuard } from "@gateway/core/guards/jwt-access-check.guard";
import { GetFollowingsPostsSwagger } from "@gateway/core/decorators/swagger/main/get-followings-posts.decorator";
import { CreatePostCommentSwagger } from "@gateway/core/decorators/swagger/main/create-post-comment.decorator";
import { GetPostCommentsSwagger } from "@gateway/core/decorators/swagger/main/get-post-comments.decorator";
import { ProfileAuthClientService } from "@gateway/microservices/auth/profile/profile-auth-clien.service";
import { FilesClientService } from "@gateway/microservices/files/files-client.service";
// контроллер отвечает за запросы к сервису постов
@ApiTags(ApiTagsNames.POSTS)
@Controller(MainRouterPaths.POSTS)
export class PostsClientController {
	constructor(
		private readonly postsClientService: PostsClientService,
		private readonly profileClientService: ProfileAuthClientService,
		private readonly filesClientService: FilesClientService,
	) {}

	@UploadPostImagesSwagger()
	@Post(MainRouterPaths.IMAGES)
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAccessAuthGuard)
	@UseInterceptors(StreamingFileInterceptor)
	async uploadPostImages(@Param("postId") postId: string, @Req() req: Request): Promise<any> {
		const result = await this.postsClientService.uploadPostImages(postId, req);
		return result;
	}

	@CreatePostSwagger()
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAccessAuthGuard)
	async createPost(@ExtractUserFromRequest() user: PayloadFromRequestDto, @Body() dto: CreatePostDto): Promise<CreatePostOutputDto> {
		const result = await this.postsClientService.createPost(user.userId, dto.description);
		return result;
	}

	@DeletePostSwagger()
	@Delete(RouteParams.POST_ID)
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(JwtAccessAuthGuard)
	async deletePost(@ExtractUserFromRequest() user: PayloadFromRequestDto, @Param() { postId }: PostIdParamDto): Promise<void> {
		await this.postsClientService.deletePost(user.userId, postId);
	}

	@UpdatePostSwagger()
	@Put(RouteParams.POST_ID)
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(JwtAccessAuthGuard)
	async updatePost(@ExtractUserFromRequest() user: PayloadFromRequestDto, @Param() { postId }: PostIdParamDto, @Body() dto: CreatePostDto): Promise<void> {
		await this.postsClientService.updatePost({ userId: user.userId, postId, description: dto.description });
	}

	@GetUserPostsSwagger()
	@Get(`user/${RouteParams.USER_ID}`)
	@HttpCode(HttpStatus.OK)
	async getUserPosts(@Param() { userId }: UserIdParamDto, @Query() query: GetUserPostsQueryDto): Promise<UserPostsOutputDto> {
		return await this.postsClientService.getUserPosts(userId, query);
	}

	@GetLatestPostsSwagger()
	@Get(MainRouterPaths.LATEST_POSTS)
	@HttpCode(HttpStatus.OK)
	async getLatestPosts(): Promise<PostOutputDto[]> {
		return await this.postsClientService.getLatestPosts();
	}

	@GetFollowingsPostsSwagger()
	@UseGuards(JwtAccessAuthGuard)
	@Get(MainRouterPaths.FOLLOWINGS)
	@HttpCode(HttpStatus.OK)
	async getFollowingsPost(@ExtractUserFromRequest() user: PayloadFromRequestDto, @Query() query: GetFollowingsPostsQueryDto): Promise<UserPostsOutputDto> {
		return await this.postsClientService.getFollowingsPosts(user.userId, query);
	}

	@CreatePostCommentSwagger()
	@Post(`${RouteParams.POST_ID}/${MainRouterPaths.COMMENTS}`)
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAccessAuthGuard)
	async createPostComment(
		@ExtractUserFromRequest() user: PayloadFromRequestDto,
		@Body() dto: CreateCommentInputDto,
		@Param() { postId }: PostIdParamDto,
	): Promise<CommentOutputDto> {
		const result = await this.postsClientService.createPostComment(user.userId, dto, postId);
		return result;
	}

	//todo infinity scroll for correct view
	@GetPostCommentsSwagger()
	@Get(`${RouteParams.POST_ID}/${MainRouterPaths.COMMENTS}`)
	@UseGuards(JwtAccessCheckGuard)
	@HttpCode(HttpStatus.OK)
	async getPostComments(@Req() req: Request, @Param() { postId }: PostIdParamDto): Promise<CommentOutputDto[]> {
		// @ts-expect-error
		const authorizedCurrentUserId = req.user?.userId || null;
		const result = await this.postsClientService.getPostComments(authorizedCurrentUserId, postId);
		return result;
	}

	@GetPostSwagger()
	@UseGuards(JwtAccessCheckGuard)
	@Get(RouteParams.POST_ID)
	@HttpCode(HttpStatus.OK)
	async getPost(@Req() req: Request, @Param() { postId }: PostIdParamDto): Promise<PostOutputDto> {
		// @ts-expect-error
		const authorizedCurrentUserId = req.user?.userId || null;
		return await this.postsClientService.getPost(postId, authorizedCurrentUserId);
	}
}

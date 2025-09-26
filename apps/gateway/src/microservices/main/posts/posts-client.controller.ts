import { JwtAccessAuthGuard } from "@gateway/core/guards/jwt-access-auth.guard";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { PostsClientService } from "./posts-client.service";
import { StreamingFileInterceptor } from "@gateway/core/interceptors/streaming-file.interceptor";
import { UploadPostImagesSwagger } from "@gateway/core/decorators/swagger/post/upload-post-images.decorator";
import { ApiTagsNames, MainRouterPaths, RouteParams } from "@libs/constants/index";
import { Request } from "express";
import { CreatePostDto, CreatePostOutputDto, GetUserPostsQueryDto, PayloadFromRequestDto, PostIdParamDto, UserIdParamDto } from "@libs/contracts/index";
import { ExtractUserFromRequest } from "@gateway/core/decorators/param/extract-user-from-request";
import { CreatePostSwagger } from "@gateway/core/decorators/swagger/main/create-post-swagger.decorator";
import { DeletePostSwagger } from "@gateway/core/decorators/swagger/main/delete-post-swagger.decorator";
import { UpdatePostSwagger } from "@gateway/core/decorators/swagger/main/update-post-swagger.decorator";
import { GetUserPostsSwagger } from "@gateway/core/decorators/swagger/main/get-user-posts-swagger.decorator";
import { PostOutputDto, UserPostsOutputDto } from "@libs/contracts/main-contracts/output/user-posts-output.dto";
import { ApiTags } from "@nestjs/swagger";
import { GetPostSwagger } from "@gateway/core/decorators/swagger/main/get-post.decorator";
import { GetLastPostsSwagger } from "@gateway/core/decorators/swagger/main/get-last-posts.decorator";

// контроллер отвечает за запросы к сервису постов
@ApiTags(ApiTagsNames.POSTS)
@Controller(MainRouterPaths.POSTS)
export class PostsClientController {
	constructor(private readonly postsClientService: PostsClientService) {}

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

	@GetLastPostsSwagger()
	@Get(MainRouterPaths.LAST_POSTS)
	@HttpCode(HttpStatus.OK)
	async getLastPosts(): Promise<PostOutputDto[]> {
		return await this.postsClientService.getLastPosts();
	}

	@GetPostSwagger()
	@Get(RouteParams.POST_ID)
	@HttpCode(HttpStatus.OK)
	async getPost(@Param() { postId }: PostIdParamDto): Promise<PostOutputDto> {
		return await this.postsClientService.getPost(postId);
	}
}

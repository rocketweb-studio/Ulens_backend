import { ExtractUserFromRequest } from "@gateway/core/decorators/param/extract-user-from-request";
import { JwtAccessAuthGuard } from "@gateway/core/guards/jwt-access-auth.guard";
import { Body, Controller, HttpCode, HttpStatus, Post, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { PostsClientService } from "./posts-client.service";
import { CreatePostDto } from "@libs/contracts/main-contracts/input/create-post.input.dto";
import { ApiOperation, ApiConsumes, ApiBody, ApiResponse } from "@nestjs/swagger";

// контроллер отвечает за запросы к сервису постов
@Controller("posts")
export class PostsClientController {
	constructor(private readonly postsClientService: PostsClientService) {}

	// todo вынести сваггер в отдельный файл и доработаь
	@ApiOperation({ summary: "Create a new post with images" })
	@ApiConsumes("multipart/form-data") // This tells Swagger to use form-data
	@ApiBody({
		description: "Post data with images",
		type: CreatePostDto,
	})
	@ApiResponse({
		status: 201,
		description: "Post created successfully",
	})
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAccessAuthGuard)
	@UseInterceptors(FilesInterceptor("images", 10))
	async createPost(@UploadedFiles() files: any[], @ExtractUserFromRequest() user: any, @Body() body: CreatePostDto): Promise<any> {
		// в случае если передаем и данные то достаем их через , @Body() body: any,
		const userId = user.userId;

		return await this.postsClientService.createPost(userId, files, body.description);
	}
}

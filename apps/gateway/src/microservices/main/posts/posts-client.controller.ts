import { JwtAccessAuthGuard } from "@gateway/core/guards/jwt-access-auth.guard";
import { Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { PostsClientService } from "./posts-client.service";
import { StreamingFileInterceptor } from "@gateway/core/interceptors/streaming-file.interceptor";
import { UploadPostImagesSwagger } from "@gateway/core/decorators/swagger/post/upload-post-images.decorator";
import { MainRouterPaths } from "@libs/constants/index";
import { Request } from "express";

// контроллер отвечает за запросы к сервису постов
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
}

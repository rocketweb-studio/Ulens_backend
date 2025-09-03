import { Controller, HttpCode, HttpStatus, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiTagsNames, AuthRouterPaths } from "@libs/constants/index";
import { ApiTags } from "@nestjs/swagger";
import { ProfileAuthClientService } from "./profile-auth-clien.service";
import { JwtAccessAuthGuard } from "@gateway/core/guards/jwt-access-auth.guard";
import { ExtractUserFromRequest } from "@gateway/core/decorators/param/extract-user-from-request";
import { PayloadFromRequestDto } from "@libs/contracts/index";
import { StreamingFileInterceptor } from "../../../core/interceptors/streaming-file.interceptor";
import { UploadAvatarSwagger } from "@gateway/core/decorators/swagger/profile/upload-avatar.decorator";
import { Request } from "express";
@ApiTags(ApiTagsNames.PROFILE)
@UseGuards(JwtAccessAuthGuard)
@Controller(AuthRouterPaths.PROFILE)
export class ProfileAuthClientController {
	constructor(private readonly profileAuthClientService: ProfileAuthClientService) {}

	@UploadAvatarSwagger()
	@Post(AuthRouterPaths.AVATAR)
	@HttpCode(HttpStatus.CREATED)
	@UseInterceptors(StreamingFileInterceptor)
	async uploadAvatar(@ExtractUserFromRequest() user: PayloadFromRequestDto, @Req() req: Request): Promise<any> {
		const result = await this.profileAuthClientService.uploadAvatarStreaming(user.userId, req);
		return result;
	}
}

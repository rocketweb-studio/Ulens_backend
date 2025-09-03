import { Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiTagsNames, AuthRouterPaths } from "@libs/constants/index";
import { ApiTags } from "@nestjs/swagger";
import { ProfileAuthClientService } from "./profile-auth-client.service";
import { JwtAccessAuthGuard } from "@gateway/core/guards/jwt-access-auth.guard";
import { ExtractUserFromRequest } from "@gateway/core/decorators/param/extract-user-from-request";
import { PayloadFromRequestDto } from "@libs/contracts/index";
import { FilesInterceptor } from "@nestjs/platform-express";

@ApiTags(ApiTagsNames.PROFILE)
@UseGuards(JwtAccessAuthGuard)
@Controller(AuthRouterPaths.PROFILE)
export class ProfileAuthClientController {
	constructor(private readonly profileAuthClientService: ProfileAuthClientService) {}

	@Post(AuthRouterPaths.AVATAR)
	@UseInterceptors(FilesInterceptor("avatar", 1))
	async uploadAvatar(@ExtractUserFromRequest() user: PayloadFromRequestDto, @UploadedFiles() files: any): Promise<any> {
		return this.profileAuthClientService.uploadAvatar(user.userId, files[0]);
	}
}

import { ExtractUserFromRequest } from "@gateway/core/decorators/param/extract-user-from-request";
import { JwtAccessAuthGuard } from "@gateway/core/guards/jwt-access-auth.guard";
import { Controller, HttpCode, HttpStatus, Post, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ProfileClientService } from "./profile-client.service";
import { ApiOperation, ApiConsumes, ApiBody, ApiResponse } from "@nestjs/swagger";

// контроллер отвечает за запросы к сервису профиля
@Controller("profile")
export class ProfileClientController {
	constructor(private readonly profileClientService: ProfileClientService) {}

	// todo вынести сваггер в отдельный файл и доработаь
	@ApiOperation({ summary: "Upadte profile avatar" })
	@ApiConsumes("multipart/form-data") // This tells Swagger to use form-data
	@ApiBody({
		description: "Profile avatar",
		// type: UpdateAvatarDto,
	})
	@ApiResponse({
		status: 201,
		description: "Profile avatar updated successfully",
	})
	@Post("avatar")
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAccessAuthGuard)
	@UseInterceptors(FilesInterceptor("avatar", 1))
	async updateProfileAvatar(@UploadedFiles() files: any[], @ExtractUserFromRequest() user: any): Promise<any> {
		// в случае если передаем и данные то достаем их через , @Body() body: any,
		const userId = user.userId;
		const file = files[0];

		return await this.profileClientService.updateProfileAvatar(userId, file);
	}
}

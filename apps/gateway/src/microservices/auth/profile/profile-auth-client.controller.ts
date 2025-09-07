import { Controller, HttpCode, HttpStatus, Post, Req, UseGuards, UseInterceptors, Get, Put, Body, Delete } from "@nestjs/common";
import { ApiTagsNames, ProfileRouterPaths } from "@libs/constants/index";
import { ApiTags } from "@nestjs/swagger";
import { ProfileAuthClientService } from "./profile-auth-clien.service";
import { JwtAccessAuthGuard } from "@gateway/core/guards/jwt-access-auth.guard";
import { ExtractUserFromRequest } from "@gateway/core/decorators/param/extract-user-from-request";
import { PayloadFromRequestDto, ProfileInputDto, ProfileOutputDto, ProfileOutputWithAvatarDto } from "@libs/contracts/index";
import { StreamingFileInterceptor } from "../../../core/interceptors/streaming-file.interceptor";
import { UploadAvatarSwagger } from "@gateway/core/decorators/swagger/profile/upload-avatar.decorator";
import { Request } from "express";
import { GetProfileSwagger } from "@gateway/core/decorators/swagger/profile/get-profile.decorator";
import { UpdateProfileSwagger } from "@gateway/core/decorators/swagger/profile/update-profile.decorator";
import { DeleteProfileSwagger } from "@gateway/core/decorators/swagger/profile/delete-profile.decorator";
import { DeleteProfileAvatarSwagger } from "@gateway/core/decorators/swagger/profile/delete-profile-avatar.decorator";

@ApiTags(ApiTagsNames.PROFILE)
@UseGuards(JwtAccessAuthGuard)
@Controller(ProfileRouterPaths.PROFILE)
export class ProfileAuthClientController {
	constructor(private readonly profileAuthClientService: ProfileAuthClientService) {}

	@GetProfileSwagger()
	@Get()
	@HttpCode(HttpStatus.OK)
	async getProfile(@ExtractUserFromRequest() user: PayloadFromRequestDto): Promise<ProfileOutputWithAvatarDto> {
		const result = await this.profileAuthClientService.getProfile(user.userId);
		return result;
	}

	@UpdateProfileSwagger()
	@Put()
	@HttpCode(HttpStatus.OK)
	async updateProfile(@ExtractUserFromRequest() user: PayloadFromRequestDto, @Body() dto: ProfileInputDto): Promise<ProfileOutputDto> {
		const result = await this.profileAuthClientService.updateProfile(user.userId, dto);
		return result;
	}

	@UploadAvatarSwagger()
	@Post(ProfileRouterPaths.AVATAR)
	@HttpCode(HttpStatus.CREATED)
	@UseInterceptors(StreamingFileInterceptor)
	async uploadAvatar(@ExtractUserFromRequest() user: PayloadFromRequestDto, @Req() req: Request): Promise<any> {
		const result = await this.profileAuthClientService.uploadAvatarStreaming(user.userId, req);
		return result;
	}

	@DeleteProfileAvatarSwagger()
	@Delete(ProfileRouterPaths.AVATAR)
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteProfileAvatar(@ExtractUserFromRequest() user: PayloadFromRequestDto): Promise<void> {
		await this.profileAuthClientService.deleteProfileAvatar(user.userId);
		return;
	}

	//* Endpoint for testing, profile deleting is not required
	@DeleteProfileSwagger()
	@Delete()
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteProfile(@ExtractUserFromRequest() user: PayloadFromRequestDto): Promise<void> {
		await this.profileAuthClientService.deleteProfile(user.userId);
		return;
	}
}

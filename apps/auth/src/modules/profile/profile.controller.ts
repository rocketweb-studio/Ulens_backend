import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AuthMessages } from "@libs/constants/index";
import { IProfileQueryRepository } from "./profile.interfaces";
import { ProfileInputDto } from "@libs/contracts/index";
import { ProfileOutputDto } from "@libs/contracts/auth-contracts/output/profile.output.dto";
import { ProfileService } from "./profile.service";

@Controller()
export class ProfileController {
	constructor(
		private readonly profileQueryRepository: IProfileQueryRepository,
		private readonly profileService: ProfileService,
	) {}

	@MessagePattern({ cmd: AuthMessages.GET_PROFILE })
	async getProfile(@Payload() payload: { userId: string }): Promise<ProfileOutputDto> {
		return await this.profileQueryRepository.getProfileByUserId(payload.userId);
	}

	@MessagePattern({ cmd: AuthMessages.GET_PROFILES })
	async getProfiles(@Payload() payload: { userIds: string[] }): Promise<ProfileOutputDto[]> {
		return await this.profileQueryRepository.getProfiles(payload.userIds);
	}

	@MessagePattern({ cmd: AuthMessages.UPDATE_PROFILE })
	async updateProfile(@Payload() payload: { userId: string; dto: ProfileInputDto }): Promise<ProfileOutputDto> {
		const profileUserId = await this.profileService.updateProfile(payload.userId, payload.dto);
		return await this.profileQueryRepository.getProfileByUserId(profileUserId);
	}

	@MessagePattern({ cmd: AuthMessages.DELETE_PROFILE })
	async deleteProfile(@Payload() payload: { userId: string }): Promise<boolean> {
		return await this.profileService.deleteProfile(payload.userId);
	}
}

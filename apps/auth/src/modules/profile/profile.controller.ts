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
		return await this.profileQueryRepository.getProfile(payload.userId);
	}

	@MessagePattern({ cmd: AuthMessages.UPDATE_PROFILE })
	async updateProfile(@Payload() payload: { userId: string; dto: ProfileInputDto }): Promise<ProfileOutputDto> {
		return await this.profileService.updateProfile(payload.userId, payload.dto);
	}

	@MessagePattern({ cmd: AuthMessages.DELETE_PROFILE })
	async deleteProfile(@Payload() payload: { userId: string }): Promise<boolean> {
		return await this.profileService.deleteProfile(payload.userId);
	}
}

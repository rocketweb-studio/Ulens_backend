import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MainMessages } from "@libs/constants/main-messages";
import { ProfileService } from "./profile.service";
import { CreateProfileDto } from "@libs/contracts/index";

@Controller()
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@MessagePattern({ cmd: MainMessages.CREATE_PROFILE })
	async createProfile(@Payload() createProfileDto: CreateProfileDto): Promise<boolean> {
		return this.profileService.createProfile(createProfileDto);
	}
}

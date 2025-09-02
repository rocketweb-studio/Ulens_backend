// import { Controller } from "@nestjs/common";
// import { MessagePattern, Payload } from "@nestjs/microservices";
// import { MainMessages } from "@libs/constants/main-messages";
// import { ProfileService } from "./profile.service";
// import { CreateProfileDto } from "@libs/contracts/index";
// import { UpdateAvatarDto } from "@libs/contracts/main-contracts/input/update-avatar.dto";

// @Controller()
// export class ProfileController {
// 	constructor(private readonly profileService: ProfileService) {}

// 	@MessagePattern({ cmd: MainMessages.AVATAR_UPLOAD })
// 	async uploadAvatar(@Payload() updateAvatarDto: UpdateAvatarDto): Promise<{ success: boolean }> {
// 		console.log("Uploading avatar");
// 		const res = await this.profileService.updateAvatar(updateAvatarDto);
// 		return { success: true };
// 	}
// }

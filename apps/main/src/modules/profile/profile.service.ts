import { Injectable } from "@nestjs/common";
import { CreateProfileDto } from "@libs/contracts/index";
import { IProfileCommandRepository } from "./profile.interfaces";
import { UpdateAvatarDto } from "@libs/contracts/main-contracts/input/update-avatar.dto";

@Injectable()
export class ProfileService {
	constructor(private readonly prismaProfileCommandRepository: IProfileCommandRepository) {}

	async createProfile(createProfileDto: CreateProfileDto): Promise<boolean> {
		const isProfileCreated = await this.prismaProfileCommandRepository.createProfile(createProfileDto);
		return isProfileCreated;
	}

	async updateAvatar(updateAvatarDto: UpdateAvatarDto): Promise<boolean> {
		const isAvatarUpdated = await this.prismaProfileCommandRepository.updateAvatar(updateAvatarDto);
		return isAvatarUpdated;
	}
}

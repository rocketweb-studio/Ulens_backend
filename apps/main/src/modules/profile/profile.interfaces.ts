import { CreateProfileDto } from "@libs/contracts/main-contracts/input/create-profile.dto";
import { UpdateAvatarDto } from "@libs/contracts/main-contracts/input/update-avatar.dto";

export abstract class IProfileCommandRepository {
	abstract createProfile(profileDto: CreateProfileDto): Promise<boolean>;
	abstract updateAvatar(updateAvatarDto: UpdateAvatarDto): Promise<boolean>;
}

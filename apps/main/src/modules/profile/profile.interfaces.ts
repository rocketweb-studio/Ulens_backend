import { CreateProfileDto } from "@libs/contracts/main-contracts/input/create-profile.dto";

export abstract class IProfileCommandRepository {
	abstract createProfile(profileDto: CreateProfileDto): Promise<boolean>;
}

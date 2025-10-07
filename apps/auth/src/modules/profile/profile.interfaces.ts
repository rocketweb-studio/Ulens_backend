import { ProfileOutputDto } from "@libs/contracts/auth-contracts/output/profile.output.dto";
import { ProfileUpdateInputDto } from "./dto/profile-update.input.dto";

export abstract class IProfileQueryRepository {
	abstract getProfileByUserId(userId: string): Promise<ProfileOutputDto>;
}

export abstract class IProfileCommandRepository {
	abstract updateProfile(userId: string, dto: ProfileUpdateInputDto): Promise<string>;
	abstract deleteProfile(userId: string): Promise<boolean>;
	abstract findProfileByUsername(userName: string): Promise<string | null>;
}

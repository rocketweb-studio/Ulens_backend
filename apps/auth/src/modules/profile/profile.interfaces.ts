import { ProfileOutputDto, ProfileOutputForMapDto } from "@libs/contracts/auth-contracts/output/profile.output.dto";
import { ProfileUpdateInputDto } from "@auth/modules/profile/dto/profile-update.input.dto";
export abstract class IProfileQueryRepository {
	abstract getProfileByUserId(userId: string, authorizedCurrentUserId: string | null): Promise<ProfileOutputDto>;
	abstract getProfiles(userIds: string[]): Promise<ProfileOutputForMapDto[]>;
	abstract getProfilesByUserName(userName: string): Promise<ProfileOutputForMapDto[]>;
}

export abstract class IProfileCommandRepository {
	abstract updateProfile(userId: string, dto: ProfileUpdateInputDto): Promise<string>;
	abstract deleteProfile(userId: string): Promise<boolean>;
	abstract findProfileByUsername(userName: string): Promise<string | null>;
}

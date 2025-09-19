import { ProfileOutputDto } from "@libs/contracts/auth-contracts/output/profile.output.dto";
import { ProfileInputDto } from "@libs/contracts/index";

export abstract class IProfileQueryRepository {
	abstract getProfileByUserId(userId: string): Promise<ProfileOutputDto>;
}

export abstract class IProfileCommandRepository {
	abstract updateProfile(userId: string, dto: ProfileInputDto): Promise<string>;
	abstract deleteProfile(userId: string): Promise<boolean>;
}

import { ProfileOutputDto } from "@libs/contracts/auth-contracts/output/profile.output.dto";
import { ProfileInputDto } from "@libs/contracts/index";

export abstract class IProfileQueryRepository {
	abstract getProfile(userId: string): Promise<ProfileOutputDto>;
}

export abstract class IProfileCommandRepository {
	abstract updateProfile(userId: string, dto: ProfileInputDto): Promise<ProfileOutputDto>;
	abstract deleteProfile(userId: string): Promise<boolean>;
}

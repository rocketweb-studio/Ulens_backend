import { Injectable } from "@nestjs/common";
import { IProfileQueryRepository } from "../profile.interfaces";
import { PrismaService } from "@auth/core/prisma/prisma.service";
import { Profile } from "@auth/core/prisma/generated/client";
import { ProfileOutputDto } from "@libs/contracts/auth-contracts/output/profile.output.dto";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";

@Injectable()
export class PrismaProfileQueryRepository implements IProfileQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getProfileByUserId(userId: string): Promise<ProfileOutputDto> {
		const profile = await this.prisma.profile.findFirst({
			where: { userId },
		});
		if (!profile) throw new NotFoundRpcException("Profile not found");
		return this._mapToView(profile);
	}

	private _mapToView(profile: Profile): ProfileOutputDto {
		return {
			id: profile.userId,
			userName: profile.userName,
			firstName: profile.firstName,
			lastName: profile.lastName,
			city: profile.city,
			country: profile.country,
			region: profile.region,
			dateOfBirth: profile.dateOfBirth?.toISOString().split("T")[0] || null,
			aboutMe: profile.aboutMe,
			createdAt: profile.createdAt,
		};
	}
}

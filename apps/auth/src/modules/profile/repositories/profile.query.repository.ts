import { Injectable } from "@nestjs/common";
import { IProfileQueryRepository } from "@auth/modules/profile/profile.interfaces";
import { PrismaService } from "@auth/core/prisma/prisma.service";
import { Profile } from "@auth/core/prisma/generated/client";
import { ProfileOutputDto } from "@libs/contracts/auth-contracts/output/profile.output.dto";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";

@Injectable()
export class PrismaProfileQueryRepository implements IProfileQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getProfileByUserId(userId: string): Promise<ProfileOutputDto> {
		const profile = await this.prisma.profile.findFirst({
			where: { userId, user: { deletedAt: null } },
		});
		if (!profile) throw new NotFoundRpcException("Profile not found");
		return this._mapToView(profile);
	}

	async getProfiles(userIds: string[]): Promise<ProfileOutputDto[]> {
		const profiles = await this.prisma.profile.findMany({
			where: { userId: { in: userIds }, deletedAt: null },
		});
		return profiles.map(this._mapToView);
	}

	private _mapToView(profile: Profile): ProfileOutputDto {
		const formatDate = (date: Date): string => {
			const day = String(date.getDate()).padStart(2, "0");
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const year = date.getFullYear();
			return `${day}.${month}.${year}`;
		};
		return {
			id: profile.userId,
			userName: profile.userName,
			firstName: profile.firstName,
			lastName: profile.lastName,
			city: profile.city || "",
			country: profile.country || "",
			dateOfBirth: profile.dateOfBirth ? formatDate(profile.dateOfBirth) : null,
			aboutMe: profile.aboutMe,
			createdAt: profile.createdAt,
		};
	}
}

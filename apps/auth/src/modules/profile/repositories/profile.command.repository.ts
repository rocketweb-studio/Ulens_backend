import { Injectable } from "@nestjs/common";
import { IProfileCommandRepository } from "../profile.interfaces";
import { PrismaService } from "@auth/core/prisma/prisma.service";
import { ProfileOutputDto } from "@libs/contracts/auth-contracts/output/profile.output.dto";
import { ProfileInputDto } from "@libs/contracts/index";
import { Profile } from "@auth/core/prisma/generated/client";
@Injectable()
export class PrismaProfileCommandRepository implements IProfileCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async updateProfile(userId: string, dto: ProfileInputDto): Promise<ProfileOutputDto> {
		const profile = await this.prisma.profile.update({
			where: { userId },
			data: {
				userName: dto.userName,
				firstName: dto.firstName,
				lastName: dto.lastName,
				city: dto.city,
				country: dto.country,
				region: dto.region,
				dateOfBirth: dto.dateOfBirth,
				aboutMe: dto.aboutMe,
			},
		});
		return this._mapToView(profile);
	}

	async deleteProfile(userId: string): Promise<boolean> {
		const { count } = await this.prisma.profile.updateMany({
			where: { userId },
			data: { deletedAt: new Date() },
		});
		return count === 1;
	}

	private _mapToView(profile: Profile): ProfileOutputDto {
		return {
			userName: profile.userName,
			firstName: profile.firstName,
			lastName: profile.lastName,
			city: profile.city,
			country: profile.country,
			region: profile.region,
			dateOfBirth: profile.dateOfBirth,
			aboutMe: profile.aboutMe,
			createdAt: profile.createdAt,
		};
	}
}

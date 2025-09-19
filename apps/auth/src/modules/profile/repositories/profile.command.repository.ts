import { Injectable } from "@nestjs/common";
import { IProfileCommandRepository } from "../profile.interfaces";
import { PrismaService } from "@auth/core/prisma/prisma.service";
import { ProfileInputDto } from "@libs/contracts/index";
@Injectable()
export class PrismaProfileCommandRepository implements IProfileCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async updateProfile(userId: string, dto: ProfileInputDto): Promise<string> {
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
		return profile.userId;
	}

	async deleteProfile(userId: string): Promise<boolean> {
		const { count } = await this.prisma.profile.updateMany({
			where: { userId },
			data: { deletedAt: new Date() },
		});
		return count === 1;
	}
}

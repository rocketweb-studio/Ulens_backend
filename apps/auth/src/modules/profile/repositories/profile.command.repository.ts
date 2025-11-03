import { Injectable } from "@nestjs/common";
import { IProfileCommandRepository } from "@auth/modules/profile/profile.interfaces";
import { PrismaService } from "@auth/core/prisma/prisma.service";
import { ProfileUpdateInputDto } from "@auth/modules/profile/dto/profile-update.input.dto";
@Injectable()
export class PrismaProfileCommandRepository implements IProfileCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async updateProfile(userId: string, dto: ProfileUpdateInputDto): Promise<string> {
		const profile = await this.prisma.profile.update({
			where: { userId },
			data: {
				userName: dto.userName,
				firstName: dto.firstName,
				lastName: dto.lastName,
				city: dto.city,
				country: dto.country,
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

	async findProfileByUsername(userName: string): Promise<string | null> {
		const profile = await this.prisma.profile.findFirst({
			where: { userName, deletedAt: null },
			select: {
				userId: true,
			},
		});
		return profile?.userId || null;
	}
}

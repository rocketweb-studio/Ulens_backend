import { Injectable } from "@nestjs/common";
import { IProfileCommandRepository } from "../profile.interfaces";
import { PrismaService } from "@main/core/prisma/prisma.service";
import { CreateProfileDto } from "@libs/contracts/index";

@Injectable()
export class PrismaProfileCommandRepository implements IProfileCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createProfile(profileDto: CreateProfileDto): Promise<boolean> {
		const profile = await this.prisma.profile.create({
			data: profileDto,
		});
		return !!profile;
	}
}

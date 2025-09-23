import { Injectable } from "@nestjs/common";
import { IProfileCommandRepository } from "./profile.interfaces";
import { ProfileInputDto } from "@libs/contracts/index";
import { BadRequestRpcException, NotFoundRpcException } from "@libs/exeption/rpc-exeption";

@Injectable()
export class ProfileService {
	constructor(private readonly prismaProfileCommandRepository: IProfileCommandRepository) {}

	async updateProfile(userId: string, dto: ProfileInputDto): Promise<string> {
		const userIdWithSameUsernameExists = await this.prismaProfileCommandRepository.findProfileByUsername(dto.userName);
		if (userIdWithSameUsernameExists && userIdWithSameUsernameExists !== userId) throw new BadRequestRpcException("Username is already taken", "userName");
		const birthday = new Date(dto.dateOfBirth);
		birthday.setHours(12, 0, 0, 0);
		return await this.prismaProfileCommandRepository.updateProfile(userId, { ...dto, dateOfBirth: birthday });
	}

	async deleteProfile(userId: string): Promise<boolean> {
		const isDeleted = await this.prismaProfileCommandRepository.deleteProfile(userId);
		if (!isDeleted) throw new NotFoundRpcException("Profile not found");
		return isDeleted;
	}
}

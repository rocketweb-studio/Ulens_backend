import { Injectable } from "@nestjs/common";
import { CreateProfileDto } from "@libs/contracts/index";
import { IProfileCommandRepository } from "./profile.interfaces";

@Injectable()
export class ProfileService {
	constructor(private readonly prismaProfileCommandRepository: IProfileCommandRepository) {}

	async createProfile(createProfileDto: CreateProfileDto): Promise<boolean> {
		const isProfileCreated = await this.prismaProfileCommandRepository.createProfile(createProfileDto);
		return isProfileCreated;
	}
}

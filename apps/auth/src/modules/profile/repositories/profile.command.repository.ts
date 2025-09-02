// import { Injectable } from "@nestjs/common";
// import { IProfileCommandRepository } from "../profile.interfaces";
// import { PrismaService } from "@auth/core/prisma/prisma.service";
// import { CreateProfileDto } from "@libs/contracts/index";
// // import { UpdateAvatarDto } from "@libs/contracts/main-contracts/input/update-avatar.dto";

// @Injectable()
// export class PrismaProfileCommandRepository implements IProfileCommandRepository {
// 	constructor(private readonly prisma: PrismaService) {}

// async updateAvatar(updateAvatarDto: UpdateAvatarDto): Promise<boolean> {
// 	const user = await this.prisma.profile.findFirst({
// 		where: { id: updateAvatarDto.userId },
// 	});
// 	console.log("updateAvatarDto.userId", updateAvatarDto.userId);

// 	console.log("User", user);
// 	const avatar = await this.prisma.profile.update({
// 		where: { id: updateAvatarDto.userId },
// 		data: { avatarUrl: updateAvatarDto.filename },
// 	});
// 	return !!avatar;
// }
// }

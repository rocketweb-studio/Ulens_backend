import { Injectable } from "@nestjs/common";
import { IFilesCommandRepository } from "@files/modules/files/files.interfaces";
import { AvatarInputDto } from "@files/modules/files/dto/avatar.input.dto";
import { PrismaService } from "@files/core/prisma/prisma.service";

@Injectable()
export class PrismaFilesCommandRepository implements IFilesCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async saveAvatar(data: AvatarInputDto): Promise<boolean> {
		const result = await this.prisma.avatar.createMany({
			data: data.versions.map((version) => ({
				parentId: data.userId,
				url: version.url,
				width: version.width,
				height: version.height,
				fileSize: version.fileSize,
			})),
		});
		if (result.count > 0) {
			await this.prisma.avatar.deleteMany({
				where: {
					parentId: data.userId,
				},
			});
			return true;
		}
		return false;
	}
}

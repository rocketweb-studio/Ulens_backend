import { Injectable } from "@nestjs/common";
import { PrismaService } from "@files/core/prisma/prisma.service";
import { IFilesQueryRepository } from "@files/modules/files/files.interfaces";
import { Prisma } from "@files/core/prisma/generated/client";
import { ImageOutputDto } from "@libs/contracts/index";

@Injectable()
export class PrismaFilesQueryRepository implements IFilesQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findAvatarByUserId(userId: string): Promise<ImageOutputDto[]> {
		const avatars = await this.prisma.avatar.findMany({
			where: {
				parentId: userId,
			},
		});
		return avatars.map((avatar) => this._mapToViewDto(avatar));
	}

	async findPostImagesByPostId(postId: string): Promise<ImageOutputDto[]> {
		const postImages = await this.prisma.post.findMany({
			where: {
				parentId: postId,
			},
		});
		return postImages.map((postImage) => this._mapToViewDto(postImage));
	}

	// biome-ignore lint/complexity/noBannedTypes: <no data transfer object>
	private _mapToViewDto(avatar: Prisma.AvatarGetPayload<{}>): ImageOutputDto {
		return {
			url: avatar.url,
			width: avatar.width,
			height: avatar.height,
			fileSize: avatar.fileSize,
			createdAt: avatar.createdAt,
			uploadId: avatar.id,
		};
	}
}

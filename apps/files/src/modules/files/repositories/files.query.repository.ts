import { Injectable } from "@nestjs/common";
import { PrismaService } from "@files/core/prisma/prisma.service";
import { IFilesQueryRepository } from "@files/modules/files/files.interfaces";
import { Avatar } from "@files/core/prisma/generated/client";
import { ImageOutputDto, PostImagesOutputDto } from "@libs/contracts/index";

@Injectable()
export class PrismaFilesQueryRepository implements IFilesQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findAvatarByUserId(userId: string): Promise<ImageOutputDto[]> {
		const avatars = await this.prisma.avatar.findMany({
			where: {
				parentId: userId,
			},
		});
		return avatars.map((avatar) => this._mapAvatarToViewDto(avatar));
	}

	async findPostImagesByPostId(postId: string): Promise<ImageOutputDto[]> {
		const postImages = await this.prisma.post.findMany({
			where: {
				parentId: postId,
			},
		});
		return postImages.map((postImage) => this._mapAvatarToViewDto(postImage));
	}

	async getAvatarsByUserId(userId: string): Promise<ImageOutputDto[]> {
		const avatars = await this.prisma.avatar.findMany({
			where: { parentId: userId },
		});

		return avatars.map((avatar) => this._mapAvatarToViewDto(avatar));
	}

	// todo я бы убрал этот метод, и использовал тот что выше - getUserAvatars
	/*они уже были написаны, а эти замены это переписывание dto и тд + этим методом мы получаем
		только то что нам нужно и не гоняем лишние данные*/
	async getAvatarUrlByUserId(userId: string): Promise<{ url: string } | null> {
		const avatarUrl = await this.prisma.avatar.findFirst({
			where: { parentId: userId },
			select: { url: true },
		});
		if (!avatarUrl) return null;

		return avatarUrl;
	}

	async getImagesByPostIds(postIds: string[]): Promise<PostImagesOutputDto[]> {
		const postImages = await this.prisma.post.findMany({
			where: { parentId: { in: postIds }, deletedAt: null },
			orderBy: [{ createdAt: "desc" }],
			select: {
				id: true,
				parentId: true,
				url: true,
				width: true,
				height: true,
				fileSize: true,
				createdAt: true,
			},
		});
		return postImages;
	}

	private _mapAvatarToViewDto(avatar: Avatar): ImageOutputDto {
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

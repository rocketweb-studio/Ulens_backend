import { Injectable } from "@nestjs/common";
import { PrismaService } from "@files/core/prisma/prisma.service";
import { IFilesQueryRepository } from "@files/modules/files/files.interfaces";
import { Avatar, Post } from "@files/core/prisma/generated/client";
import { AvatarImagesOutputDto, PostImagesOutputDto, PostImagesOutputForMapDto } from "@libs/contracts/index";
import { FilesSizes } from "@libs/constants/files.constants";

@Injectable()
export class PrismaFilesQueryRepository implements IFilesQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findAvatarByUserId(userId: string): Promise<AvatarImagesOutputDto> {
		const avatars = await this.prisma.avatar.findMany({
			where: {
				parentId: userId,
			},
		});
		return this._mapAvatarsToViewDto(avatars);
	}

	async findPostImagesByPostId(postId: string): Promise<PostImagesOutputDto> {
		const postImages = await this.prisma.post.findMany({
			where: {
				parentId: postId,
			},
			orderBy: [{ createdAt: "desc" }],
		});
		return this._mapPostImagesToViewDto(postImages);
	}

	async getAvatarsByUserId(userId: string): Promise<AvatarImagesOutputDto> {
		const avatars = await this.prisma.avatar.findMany({
			where: { parentId: userId },
		});

		return this._mapAvatarsToViewDto(avatars);
	}

	async getImagesByPostIds(postIds: string[]): Promise<PostImagesOutputForMapDto[]> {
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
				size: true,
			},
		});
		return postImages;
	}

	private _mapAvatarsToViewDto(avatars: Avatar[]): AvatarImagesOutputDto {
		return {
			small:
				avatars
					.filter((avatar) => avatar.size === FilesSizes.SMALL)
					.map((avatar) => ({
						url: avatar.url,
						width: avatar.width,
						height: avatar.height,
						fileSize: avatar.fileSize,
						createdAt: avatar.createdAt,
						uploadId: avatar.id,
					}))[0] || null,
			medium:
				avatars
					.filter((avatar) => avatar.size === FilesSizes.MEDIUM)
					.map((avatar) => ({
						url: avatar.url,
						width: avatar.width,
						height: avatar.height,
						fileSize: avatar.fileSize,
						createdAt: avatar.createdAt,
						uploadId: avatar.id,
					}))[0] || null,
		};
	}

	private _mapPostImagesToViewDto(postImages: Post[]): PostImagesOutputDto {
		return {
			small: postImages
				.filter((postImage) => postImage.size === FilesSizes.SMALL)
				.map((postImage) => ({
					url: postImage.url,
					width: postImage.width,
					height: postImage.height,
					fileSize: postImage.fileSize,
					createdAt: postImage.createdAt,
					uploadId: postImage.id,
				})),
			medium: postImages
				.filter((postImage) => postImage.size === FilesSizes.MEDIUM)
				.map((postImage) => ({
					url: postImage.url,
					width: postImage.width,
					height: postImage.height,
					fileSize: postImage.fileSize,
					createdAt: postImage.createdAt,
					uploadId: postImage.id,
				})),
		};
	}
}

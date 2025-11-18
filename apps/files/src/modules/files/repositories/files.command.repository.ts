import { Injectable } from "@nestjs/common";
import { IFilesCommandRepository } from "@files/modules/files/files.interfaces";
import { AvatarInputDto } from "@files/modules/files/dto/avatar.input.dto";
import { PrismaService } from "@files/core/prisma/prisma.service";
import { Avatar, Size } from "@files/core/prisma/generated/client";
import { FileVersionInputDto } from "../dto/file-version.input.dto";

@Injectable()
export class PrismaFilesCommandRepository implements IFilesCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async saveAvatar(data: AvatarInputDto): Promise<string[] | null> {
		const oldAvatars = await this.prisma.avatar.findMany({
			where: {
				parentId: data.userId,
			},
		});

		const result = await this.prisma.avatar.createMany({
			data: data.versions.map((version) => ({
				parentId: data.userId,
				url: version.url,
				width: version.width,
				height: version.height,
				fileSize: version.fileSize,
				size: version.size,
			})),
		});
		if (result.count > 0) {
			await this.prisma.avatar.deleteMany({
				where: {
					parentId: data.userId,
					id: {
						in: oldAvatars.map((avatar) => avatar.id),
					},
				},
			});
			return oldAvatars.map((avatar) => this._mapToViewDto(avatar));
		}
		return null;
	}

	async savePostImages(data: any): Promise<boolean> {
		const result = await this.prisma.post.createMany({
			data: data.versions.map((version) => ({
				parentId: data.postId,
				url: version.url,
				width: version.width,
				height: version.height,
				fileSize: version.fileSize,
				size: version.size,
			})),
		});
		if (result.count > 0) {
			return true;
		}
		return false;
	}

	async saveMessageImages(data: { roomId: number; versions: FileVersionInputDto[] }): Promise<string[]> {
		const result = await this.prisma.messageImage.createManyAndReturn({
			data: data.versions.map((version: FileVersionInputDto) => ({
				roomId: data.roomId,
				url: version.url,
				width: version.width,
				height: version.height,
				fileSize: version.fileSize,
				size: version.size as Size,
			})),
		});
		return result.map((image) => image.id);
	}

	async updateMessageImages(messageId: number, imageIds: string[]): Promise<boolean> {
		const result = await this.prisma.messageImage.updateMany({
			where: { id: { in: imageIds } },
			data: { messageId },
		});
		return result.count > 0;
	}

	async deleteAvatarsByUserId(userId: string): Promise<boolean> {
		const result = await this.prisma.avatar.deleteMany({
			where: { parentId: userId },
		});
		return result.count > 0;
	}

	async softDeleteUserFiles(userId: string): Promise<void> {
		await this.prisma.avatar.updateMany({
			where: { parentId: userId },
			data: { deletedAt: new Date() },
		});

		await this.prisma.post.updateMany({
			where: { parentId: userId },
			data: { deletedAt: new Date() },
		});
	}

	private _mapToViewDto(avatar: Avatar): string {
		return avatar.url;
	}

	async deleteDeletedFiles(): Promise<void> {
		const { count } = await this.prisma.avatar.deleteMany({
			where: { deletedAt: { not: null } },
		});
		console.log(`Deleted deleted avatars: [${count}]`);
		const { count: postCount } = await this.prisma.post.deleteMany({
			where: { deletedAt: { not: null } },
		});
		console.log(`Deleted deleted posts: [${postCount}]`);
	}
}

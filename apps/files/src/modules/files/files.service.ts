import { AvatarInputDto } from "@files/modules/files/dto/avatar.input.dto";
import { IFilesCommandRepository } from "@files/modules/files/files.interfaces";
import { Injectable } from "@nestjs/common";
import { NotFoundRpcException, UnexpectedErrorRpcException } from "@libs/exeption/rpc-exeption";
import { StorageAdapter } from "@files/core/storage/storage.adapter";
import { AvatarImagesOutputDto } from "@libs/contracts/index";
import { Cron, CronExpression } from "@nestjs/schedule";
import { FileVersionInputDto } from "./dto/file-version.input.dto";
@Injectable()
export class FilesService {
	constructor(
		private readonly filesCommandRepository: IFilesCommandRepository,
		private readonly storageService: StorageAdapter,
	) {}

	async saveAvatar(data: AvatarInputDto): Promise<boolean> {
		const result = await this.filesCommandRepository.saveAvatar(data);
		if (!result) {
			throw new UnexpectedErrorRpcException("Something went wrong while saving avatar");
		}
		result.forEach(async (url) => {
			await this.storageService.deleteFile(url);
		});
		return !!result;
	}

	async savePostImages(data: any): Promise<boolean> {
		const isSaved = await this.filesCommandRepository.savePostImages(data);
		if (!isSaved) {
			throw new UnexpectedErrorRpcException("Something went wrong while saving post images");
		}
		return isSaved;
	}

	async saveMessageImages(data: { roomId: number; versions: FileVersionInputDto[] }): Promise<string[]> {
		const fileIds = await this.filesCommandRepository.saveMessageImages(data);
		if (fileIds.length === 0) {
			throw new UnexpectedErrorRpcException("Something went wrong while saving message images");
		}
		return fileIds;
	}

	async updateMessageImages(messageId: number, imageIds: string[]): Promise<boolean> {
		const isUpdated = await this.filesCommandRepository.updateMessageImages(messageId, imageIds);
		if (!isUpdated) {
			throw new UnexpectedErrorRpcException("Something went wrong while updating message images");
		}
		return isUpdated;
	}

	async deleteAvatarsByUserId(userId: string, avatars: AvatarImagesOutputDto): Promise<boolean> {
		if (!avatars.small && !avatars.medium) {
			throw new NotFoundRpcException("Avatar not found");
		}
		if (avatars.small) {
			await this.storageService.deleteFile(avatars.small.url);
		}
		if (avatars.medium) {
			await this.storageService.deleteFile(avatars.medium.url);
		}
		const isDeleted = await this.filesCommandRepository.deleteAvatarsByUserId(userId);
		if (!isDeleted) {
			throw new UnexpectedErrorRpcException("Something went wrong while deleting avatars");
		}
		return isDeleted;
	}

	async softDeleteUserFiles(userId: string): Promise<void> {
		await this.filesCommandRepository.softDeleteUserFiles(userId);
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async deleteDeletedFiles() {
		await this.filesCommandRepository.deleteDeletedFiles();
	}
}

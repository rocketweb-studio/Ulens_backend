import { AvatarInputDto } from "@files/modules/files/dto/avatar.input.dto";
import { IFilesCommandRepository } from "@files/modules/files/files.interfaces";
import { Injectable } from "@nestjs/common";
import { NotFoundRpcException, UnexpectedErrorRpcException } from "@libs/exeption/rpc-exeption";
import { StorageAdapter } from "@files/core/storage/storage.adapter";
import { ImageOutputDto } from "@libs/contracts/index";

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

	async deleteAvatarsByUserId(userId: string, avatars: ImageOutputDto[]): Promise<boolean> {
		if (avatars.length === 0) {
			throw new NotFoundRpcException("Avatar not found");
		}
		avatars.forEach(async (avatar) => {
			await this.storageService.deleteFile(avatar.url);
		});
		const isDeleted = await this.filesCommandRepository.deleteAvatarsByUserId(userId);
		if (!isDeleted) {
			throw new UnexpectedErrorRpcException("Something went wrong while deleting avatars");
		}
		return isDeleted;
	}
}

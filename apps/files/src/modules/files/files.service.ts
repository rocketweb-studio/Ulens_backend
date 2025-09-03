import { AvatarInputDto } from "@files/modules/files/dto/avatar.input.dto";
import { IFilesCommandRepository } from "@files/modules/files/files.interfaces";
import { Injectable } from "@nestjs/common";
import { UnexpectedErrorRpcException } from "@libs/exeption/rpc-exeption";

@Injectable()
export class FilesService {
	constructor(private readonly filesCommandRepository: IFilesCommandRepository) {}

	async saveAvatar(data: AvatarInputDto): Promise<boolean> {
		const isSaved = await this.filesCommandRepository.saveAvatar(data);
		if (!isSaved) {
			throw new UnexpectedErrorRpcException("Something went wrong while saving avatar");
		}
		return isSaved;
	}

	async savePostImages(data: any): Promise<boolean> {
		const isSaved = await this.filesCommandRepository.savePostImages(data);
		if (!isSaved) {
			throw new UnexpectedErrorRpcException("Something went wrong while saving post images");
		}
		return isSaved;
	}
}

import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { FilesClientService } from "@gateway/microservices/files/files-client.service";
import { BadRequestRpcException } from "@libs/exeption/index";
import { FileUploadConfigs } from "@gateway/microservices/files/upload-config/file-upload-configs";
import { StreamClientService } from "@gateway/microservices/files/stream-client.service";

@Injectable()
export class ProfileAuthClientService {
	constructor(
		private readonly filesClientService: FilesClientService,
		private readonly streamClientService: StreamClientService,
	) {}

	async uploadAvatarStreaming(userId: string, req: Request): Promise<any> {
		const uploadResult = await this.streamClientService.streamFilesToService(req, FileUploadConfigs.AVATAR);

		if (!uploadResult.success) {
			throw new BadRequestRpcException(uploadResult.errors?.join(", ") || "Avatar upload failed");
		}

		// Сохраняем информацию об аватаре в БД
		const dbResult = await this.filesClientService.saveAvatarToDB(userId, uploadResult.files[0]);

		return dbResult;
	}
}

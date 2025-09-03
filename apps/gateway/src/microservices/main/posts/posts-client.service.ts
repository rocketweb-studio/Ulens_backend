import { FilesClientService } from "@gateway/microservices/files/files-client.service";
import { Injectable } from "@nestjs/common";
import { FileUploadConfigs } from "@gateway/microservices/files/upload-config/file-upload-configs";
import { BadRequestRpcException } from "@libs/exeption/rpc-exeption";
import { StreamClientService } from "@gateway/microservices/files/stream-client.service";
import { Request } from "express";

@Injectable()
export class PostsClientService {
	constructor(
		private readonly streamClientService: StreamClientService,
		private readonly filesClientService: FilesClientService,
	) {}

	async uploadPostImages(postId: string, req: Request): Promise<any> {
		const uploadResult = await this.streamClientService.streamFilesToService(req, FileUploadConfigs.POST_IMAGES);

		if (!uploadResult.success) {
			throw new BadRequestRpcException(uploadResult.errors?.join(", ") || "Images upload failed");
		}

		// Сохраняем информацию о всех изображениях в БД
		const dbResults = await Promise.all(uploadResult.files.map((file) => this.filesClientService.savePostImagesToDB(postId, file)));

		return dbResults[0];
	}
}

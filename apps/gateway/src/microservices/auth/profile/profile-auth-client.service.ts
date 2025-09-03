import { Injectable } from "@nestjs/common";
import { FilesClientService } from "@gateway/microservices/files/files-client.service";
import { UploadFileOutputDto } from "@libs/contracts/index";

@Injectable()
export class ProfileAuthClientService {
	constructor(private readonly filesClientService: FilesClientService) {}

	async uploadAvatar(userId: string, avatar: any): Promise<any> {
		const folder = `avatars`;
		const originalname = avatar.originalname;

		const uploadResult: UploadFileOutputDto = await this.filesClientService.uploadFile(avatar, folder, originalname);
		const result = await this.filesClientService.saveAvatarToDB(userId, uploadResult);
		return result;
	}
}

import { FilesClientService } from "@gateway/microservices/files/files-client.service";
import { MainMessages } from "@libs/constants/main-messages";
import { Microservice } from "@libs/constants/microservices";
import { CreateProfileDto } from "@libs/contracts/index";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { UploadFileOutputDto } from "@libs/contracts/files-contracts/output/upload-file.output.dto";

@Injectable()
export class ProfileClientService {
	constructor(
		@Inject(Microservice.MAIN) private readonly client: ClientProxy,
		private readonly filesClientService: FilesClientService,
	) {}

	async updateProfileAvatar(userId: string, file: any): Promise<UploadFileOutputDto> {
		const filename = `avatars/${userId}.webp`;

		// todo транзакция?
		//----------------------------
		const fileResult = await this.filesClientService.uploadFile(file, filename);

		await firstValueFrom(this.client.send({ cmd: MainMessages.AVATAR_UPLOAD }, { filename, userId }));
		//----------------------------
		return fileResult;
	}

	async createProfile(createProfileDto: CreateProfileDto): Promise<boolean> {
		const result = await firstValueFrom(this.client.send({ cmd: MainMessages.CREATE_PROFILE }, createProfileDto));
		return result;
	}
}

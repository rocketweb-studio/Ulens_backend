import { Inject, Injectable } from "@nestjs/common";
import { Request } from "express";
import { FilesClientService } from "@gateway/microservices/files/files-client.service";
import { BadRequestRpcException } from "@libs/exeption/index";
import { FileUploadConfigs } from "@gateway/microservices/files/upload-config/file-upload-configs";
import { StreamClientService } from "@gateway/microservices/files/stream-client.service";
import { AuthMessages, Microservice } from "@libs/constants/index";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ProfileInputDto, ProfileOutputDto, ProfileOutputWithAvatarDto } from "@libs/contracts/index";

@Injectable()
export class ProfileAuthClientService {
	constructor(
		private readonly filesClientService: FilesClientService,
		private readonly streamClientService: StreamClientService,
		@Inject(Microservice.AUTH) private readonly client: ClientProxy,
	) {}

	async getProfile(userId: string): Promise<ProfileOutputWithAvatarDto> {
		const profile = await firstValueFrom(this.client.send({ cmd: AuthMessages.GET_PROFILE }, { userId }));
		const avatars = await this.filesClientService.getAvatarsByUserId(userId);
		return {
			...profile,
			avatars,
		};
	}

	async updateProfile(userId: string, dto: ProfileInputDto): Promise<ProfileOutputDto> {
		const profile = await firstValueFrom(this.client.send({ cmd: AuthMessages.UPDATE_PROFILE }, { userId, dto }));
		return profile;
	}

	async deleteProfile(userId: string): Promise<boolean> {
		const isDeleted = await firstValueFrom(this.client.send({ cmd: AuthMessages.DELETE_PROFILE }, { userId }));
		return isDeleted;
	}

	async uploadAvatarStreaming(userId: string, req: Request): Promise<any> {
		const uploadResult = await this.streamClientService.streamFilesToService(req, FileUploadConfigs.AVATAR);

		if (!uploadResult.success) {
			throw new BadRequestRpcException(uploadResult.errors?.join(", ") || "Avatar upload failed");
		}

		// Сохраняем информацию об аватаре в БД
		const dbResult = await this.filesClientService.saveAvatarToDB(userId, uploadResult.files[0]);

		return dbResult;
	}

	async deleteProfileAvatar(userId: string): Promise<void> {
		await this.filesClientService.deleteAvatarsByUserId(userId);
		return;
	}
}

import { FilesClientService } from "@gateway/microservices/files/files-client.service";
import { MainMessages } from "@libs/constants/main-messages";
import { Microservice } from "@libs/constants/microservices";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { randomUUID } from "node:crypto";
import { firstValueFrom } from "rxjs";

@Injectable()
export class PostsClientService {
	constructor(
		@Inject(Microservice.MAIN) private readonly client: ClientProxy,
		private readonly filesClientService: FilesClientService,
	) {}

	async createPost(userId: string, files: any[], description: string): Promise<any> {
		const postId = randomUUID();

		const filenamesArray = await this.filesClientService.uploadFiles(files, `posts/${postId}`);

		const res = await firstValueFrom(this.client.send({ cmd: MainMessages.CREATE_POST }, { filenamesArray, userId, description }));
		console.log("Post created successfully", res);
		return { message: "Post created successfully" };
	}
}

import { AuthMessages, FollowType } from "@libs/constants/index";
import { FollowingOutputDto, SearchUsersInputDto, SearchUsersOutputWithAvatarDto, UsersCountOutputDto } from "@libs/contracts/index";
import { Inject, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { Microservice } from "@libs/constants/microservices";
import { ClientProxy } from "@nestjs/microservices";
import { FilesClientService } from "@gateway/microservices/files/files-client.service";
import { BadRequestRpcException } from "@libs/exeption/rpc-exeption";

@Injectable()
export class UsersClientService {
	constructor(
		@Inject(Microservice.AUTH) private readonly client: ClientProxy,
		private readonly filesClientService: FilesClientService,
	) {}

	async getUsersCount(): Promise<UsersCountOutputDto> {
		return await firstValueFrom(this.client.send({ cmd: AuthMessages.GET_USERS_COUNT }, {}));
	}

	async getUsersBySearch(dto: SearchUsersInputDto): Promise<SearchUsersOutputWithAvatarDto> {
		const result = await firstValueFrom(this.client.send({ cmd: AuthMessages.GET_USERS_BY_SEARCH }, dto));
		const usersIds = result.items.map((user) => user.id);
		const usersAvatars = await this.filesClientService.getAvatarsByUserIds(usersIds);
		return {
			...result,
			items: result.items.map((user) => ({
				...user,
				avatar: usersAvatars.find((avatar) => avatar.userId === user.id)?.avatars.small?.url || null,
			})),
		};
	}

	async follow(dto: { currentUserId: string; userId: string }): Promise<FollowingOutputDto> {
		const isSuccess = await firstValueFrom(this.client.send({ cmd: AuthMessages.FOLLOWING }, { ...dto, followType: FollowType.FOLLOW }));
		if (!isSuccess) throw new BadRequestRpcException("Failed to follow user");
		return {
			success: true,
		};
	}

	async unfollow(dto: { currentUserId: string; userId: string }): Promise<FollowingOutputDto> {
		const isSuccess = await firstValueFrom(this.client.send({ cmd: AuthMessages.FOLLOWING }, { ...dto, followType: FollowType.UNFOLLOW }));
		if (!isSuccess) throw new BadRequestRpcException("Failed to unfollow user");
		return {
			success: true,
		};
	}
}

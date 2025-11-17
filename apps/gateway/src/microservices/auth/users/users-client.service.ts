import { AuthMessages, FollowType } from "@libs/constants/index";
import {
	FollowingOutputDto,
	GetFollowersOutputDto,
	GetFollowingsOutputDto,
	ProfileOutputWithAvatarDto,
	SearchUsersInputDto,
	SearchUsersOutputWithAvatarDto,
	UsersCountOutputDto,
} from "@libs/contracts/index";
import { Inject, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { Microservice } from "@libs/constants/microservices";
import { ClientProxy } from "@nestjs/microservices";
import { FilesClientService } from "@gateway/microservices/files/files-client.service";
import { BadRequestRpcException } from "@libs/exeption/rpc-exeption";
import { GetFollowQueryInputDto } from "@libs/contracts/auth-contracts/input/get-follow.query.input.dto";

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
		if (dto.currentUserId === dto.userId) throw new BadRequestRpcException("You cannot follow yourself");
		const isSuccess = await firstValueFrom(this.client.send({ cmd: AuthMessages.MANAGE_FOLLOWING }, { ...dto, followType: FollowType.FOLLOW }));
		if (!isSuccess) throw new BadRequestRpcException("Failed to follow user");
		return {
			success: true,
		};
	}

	async unfollow(dto: { currentUserId: string; userId: string }): Promise<FollowingOutputDto> {
		if (dto.currentUserId === dto.userId) throw new BadRequestRpcException("You cannot unfollow yourself");
		const isSuccess = await firstValueFrom(this.client.send({ cmd: AuthMessages.MANAGE_FOLLOWING }, { ...dto, followType: FollowType.UNFOLLOW }));
		if (!isSuccess) throw new BadRequestRpcException("Failed to unfollow user");
		return {
			success: true,
		};
	}

	async getFollowers(userId: string, query: GetFollowQueryInputDto): Promise<GetFollowersOutputDto> {
		const result = await firstValueFrom(this.client.send({ cmd: AuthMessages.GET_FOLLOWERS }, { userId, query }));
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

	async getFollowings(userId: string, query: GetFollowQueryInputDto): Promise<GetFollowingsOutputDto> {
		const result = await firstValueFrom(this.client.send({ cmd: AuthMessages.GET_FOLLOWINGS }, { userId, query }));
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

	async getAllFollowings(userId: string): Promise<ProfileOutputWithAvatarDto[]> {
		const result = await firstValueFrom(this.client.send({ cmd: AuthMessages.GET_ALL_FOLLOWINGS }, { userId }));
		const usersIds = result.map((user) => user.id);
		const usersAvatars = await this.filesClientService.getAvatarsByUserIds(usersIds);
		return result.map((user) => {
			const avatarData = usersAvatars.find((avatar) => avatar.userId === user.id);
			return {
				...user,
				avatars: {
					small: avatarData?.avatars.small || null,
					medium: avatarData?.avatars.medium || null,
				},
			};
		});
	}
}

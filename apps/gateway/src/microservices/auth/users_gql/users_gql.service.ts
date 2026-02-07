import { AuthMessages, Microservice } from "@libs/constants/index";
import { Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { GetUsersInput } from "@gateway/microservices/auth/users_gql/inputs/get-users.input";
import { UserModel } from "@gateway/microservices/auth/users_gql/models/user.model";
import { DeleteUserInput } from "@gateway/microservices/auth/users_gql/inputs/delete-user.input";
import { SetBlockStatusForUserInput } from "@gateway/microservices/auth/users_gql/inputs/set-block-status.input";
import { LoginAdminInput } from "@gateway/microservices/auth/users_gql/inputs/login-admin.input";
import { JwtService } from "@nestjs/jwt";
import { CoreEnvConfig } from "@gateway/core/core.config";
import { BadRequestRpcException, NotFoundRpcException } from "@libs/exeption/rpc-exeption";
import { GetFollowInput } from "./inputs/get-follow.input";
import { FollowersResponse } from "./models/followers.model";
import { FollowingsResponse } from "./models/followings.model";
import { AuthClientService } from "../auth-client.service";

export class UsersGqlClientService {
	constructor(
		@Inject(Microservice.AUTH) private readonly client: ClientProxy,
		private readonly jwtService: JwtService,
		private readonly coreEnvConfig: CoreEnvConfig,
		private readonly authClientService: AuthClientService,
	) {}

	async getUsers(input: GetUsersInput): Promise<UserModel[]> {
		const users = await firstValueFrom(this.client.send({ cmd: AuthMessages.ADMIN_GET_USERS }, input));
		return users;
	}

	async getUserFollowers(input: GetFollowInput): Promise<FollowersResponse> {
		const user = await this.authClientService.me(input.userId);
		if (!user) {
			throw new NotFoundRpcException("User not found");
		}
		const followers = await firstValueFrom(this.client.send({ cmd: AuthMessages.GET_FOLLOWERS }, { userId: input.userId, query: input }));
		console.log(followers);
		return followers;
	}

	async getUserFollowings(input: GetFollowInput): Promise<FollowingsResponse> {
		const user = await this.authClientService.me(input.userId);
		if (!user) {
			throw new NotFoundRpcException("User not found");
		}
		const followings = await firstValueFrom(this.client.send({ cmd: AuthMessages.GET_FOLLOWINGS }, { userId: input.userId, query: input }));
		return followings;
	}

	async deleteUser(input: DeleteUserInput): Promise<boolean> {
		const isDeleted = await firstValueFrom(this.client.send({ cmd: AuthMessages.ADMIN_DELETE_USER }, { userId: input.userId }));
		return isDeleted;
	}

	async setBlockStatusForUser(input: SetBlockStatusForUserInput): Promise<boolean> {
		const { userId, isBlocked, reason } = input;
		const result = await firstValueFrom(this.client.send({ cmd: AuthMessages.ADMIN_SET_BLOCK_STATUS_FOR_USER }, { userId, isBlocked, reason: reason ?? null }));
		return result;
	}

	async loginAdmin(input: LoginAdminInput): Promise<any> {
		const { email, password } = input;

		if (email !== this.coreEnvConfig.adminEmail || password !== this.coreEnvConfig.adminPassword) {
			throw new BadRequestRpcException("Invalid email or password");
		}

		const adminAccessToken = await this.jwtService.signAsync(
			{ email },
			{
				expiresIn: "6h",
				secret: this.coreEnvConfig.accessTokenSecret,
			},
		);

		return {
			adminAccessToken,
		};
	}
}

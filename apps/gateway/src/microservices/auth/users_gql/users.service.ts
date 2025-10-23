import { AuthMessages, Microservice } from "@libs/constants/index";
import { Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { GetUsersInput } from "./inputs/get-users.input";
import { UserModel } from "./models/user.model";
import { DeleteUserInput } from "./inputs/delete-user.input";
import { SetBlockStatusForUserInput } from "./inputs/set-block-status.input";
import { LoginAdminInput } from "./inputs/login-admin.input";
import { JwtService } from "@nestjs/jwt";
import { CoreEnvConfig } from "@gateway/core/core.config";
import { BadRequestRpcException } from "@libs/exeption/rpc-exeption";

export class UsersGqlClientService {
	constructor(
		@Inject(Microservice.AUTH) private readonly client: ClientProxy,
		private readonly jwtService: JwtService,
		private readonly coreEnvConfig: CoreEnvConfig,
	) {}

	async getUsers(input: GetUsersInput): Promise<UserModel[]> {
		const users = await firstValueFrom(this.client.send({ cmd: AuthMessages.ADMIN_GET_USERS }, input));
		return users;
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

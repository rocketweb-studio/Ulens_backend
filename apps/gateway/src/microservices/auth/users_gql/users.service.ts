import { AuthMessages, Microservice } from "@libs/constants/index";
import { Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { GetUsersInput } from "./inputs/get-users.input";
import { UserModel } from "./models/user.model";
import { DeleteUserInput } from "./inputs/delete-user.input";
import { SetBlockStatusForUserInput } from "./inputs/set-block-status.input";

export class UsersGqlClientService {
	constructor(@Inject(Microservice.AUTH) private readonly client: ClientProxy) {}

	async getUsers(input: GetUsersInput): Promise<UserModel[]> {
		const users = await firstValueFrom(this.client.send({ cmd: AuthMessages.ADMIN_GET_USERS }, { input }));
		return users;
	}

	async deleteUser(input: DeleteUserInput): Promise<boolean> {
		const isDeleted = await firstValueFrom(this.client.send({ cmd: AuthMessages.ADMIN_DELETE_USER }, { userId: input.userId }));
		return isDeleted;
	}

	async setBlockStatusForUser(input: SetBlockStatusForUserInput): Promise<boolean> {
		const isBlocked = await firstValueFrom(
			this.client.send({ cmd: AuthMessages.ADMIN_SET_BLOCK_STATUS_FOR_USER }, { userId: input.userId, isBlocked: input.isBlocked }),
		);
		return isBlocked;
	}
}

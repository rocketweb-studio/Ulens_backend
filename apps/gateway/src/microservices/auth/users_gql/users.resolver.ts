import { Query, Resolver, Args, Mutation } from "@nestjs/graphql";
import { UsersResponse } from "@gateway/microservices/auth/users_gql/models/user.model";
import { UsersGqlClientService } from "@gateway/microservices/auth/users_gql/users.service";
import { GetUsersInput } from "@gateway/microservices/auth/users_gql/inputs/get-users.input";
import { DeleteUserInput } from "@gateway/microservices/auth/users_gql/inputs/delete-user.input";
import { SetBlockStatusForUserInput } from "@gateway/microservices/auth/users_gql/inputs/set-block-status.input";

@Resolver("Users")
export class UsersGqlResolver {
	constructor(private readonly usersGqlClientService: UsersGqlClientService) {}

	// @UseGuards(GqlAuthGuard)
	@Query(() => UsersResponse, { name: "getUsers" })
	async getUsers(@Args("input") input: GetUsersInput) {
		return this.usersGqlClientService.getUsers(input);
	}

	@Mutation(() => Boolean, { name: "deleteUser" })
	async deleteUser(@Args("input") input: DeleteUserInput) {
		return this.usersGqlClientService.deleteUser(input);
	}

	@Mutation(() => Boolean, { name: "setBlockStatusForUser" })
	async setBlockStatusForUser(@Args("input") input: SetBlockStatusForUserInput) {
		return this.usersGqlClientService.setBlockStatusForUser(input);
	}
}

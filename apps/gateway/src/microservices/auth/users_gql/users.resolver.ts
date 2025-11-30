import { Query, Resolver, Args, Mutation } from "@nestjs/graphql";
import { UsersResponse } from "@gateway/microservices/auth/users_gql/models/user.model";
import { UsersGqlClientService } from "@gateway/microservices/auth/users_gql/users_gql.service";
import { GetUsersInput } from "@gateway/microservices/auth/users_gql/inputs/get-users.input";
import { DeleteUserInput } from "@gateway/microservices/auth/users_gql/inputs/delete-user.input";
import { SetBlockStatusForUserInput } from "@gateway/microservices/auth/users_gql/inputs/set-block-status.input";
import { LoginAdminInput } from "@gateway/microservices/auth/users_gql/inputs/login-admin.input";
import { LoginAdminModel } from "@gateway/microservices/auth/users_gql/models/login-admin.model";
import { GqlJwtAuthGuard } from "@gateway/core/guards/gql-jwt-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetFollowInput } from "./inputs/get-follow.input";
import { FollowersResponse } from "./models/followers.model";
import { FollowingsResponse } from "./models/followings.model";
@Resolver("Users")
export class UsersGqlResolver {
	constructor(private readonly usersGqlClientService: UsersGqlClientService) {}

	@UseGuards(GqlJwtAuthGuard)
	@Query(() => UsersResponse, { name: "getUsers" })
	async getUsers(@Args("input") input: GetUsersInput) {
		return this.usersGqlClientService.getUsers(input);
	}

	@UseGuards(GqlJwtAuthGuard)
	@Query(() => FollowersResponse, { name: "getUserFollowers" })
	async getUserFollowers(@Args("input") input: GetFollowInput) {
		return this.usersGqlClientService.getUserFollowers(input);
	}

	@UseGuards(GqlJwtAuthGuard)
	@Query(() => FollowingsResponse, { name: "getUserFollowings" })
	async getUserFollowings(@Args("input") input: GetFollowInput) {
		return this.usersGqlClientService.getUserFollowings(input);
	}

	@UseGuards(GqlJwtAuthGuard)
	@Mutation(() => Boolean, { name: "deleteUser" })
	async deleteUser(@Args("input") input: DeleteUserInput) {
		return this.usersGqlClientService.deleteUser(input);
	}

	@UseGuards(GqlJwtAuthGuard)
	@Mutation(() => Boolean, { name: "setBlockStatusForUser" })
	async setBlockStatusForUser(@Args("input") input: SetBlockStatusForUserInput) {
		return this.usersGqlClientService.setBlockStatusForUser(input);
	}

	@Mutation(() => LoginAdminModel, { name: "loginAdmin" })
	async loginAdmin(@Args("input") input: LoginAdminInput) {
		return this.usersGqlClientService.loginAdmin(input);
	}
}

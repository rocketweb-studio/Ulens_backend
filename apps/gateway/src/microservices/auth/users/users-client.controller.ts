import { Controller, HttpCode, HttpStatus, Get, Query, UseGuards, Post, Body } from "@nestjs/common";
import {
	FollowingInputDto,
	FollowingOutputDto,
	GetFollowersOutputDto,
	GetFollowingsOutputDto,
	PayloadFromRequestDto,
	SearchUsersInputDto,
	SearchUsersOutputWithAvatarDto,
	UsersCountOutputDto,
} from "@libs/contracts/index";
import { ApiTags } from "@nestjs/swagger";
import { ApiTagsNames, UsersRouterPaths } from "@libs/constants/index";
import { GetUsersCountSwagger } from "@gateway/core/decorators/swagger/auth/get-users-count.decorator";
import { UsersClientService } from "./users-client.service";
import { GetUsersBySearchSwagger } from "@gateway/core/decorators/swagger/auth/get-users-by-search.decorator";
import { JwtAccessAuthGuard } from "@gateway/core/guards/jwt-access-auth.guard";
import { ExtractUserFromRequest } from "@gateway/core/decorators/param/extract-user-from-request";
import { UnfollowSwagger } from "@gateway/core/decorators/swagger/auth/unfollow.decorator";
import { FollowSwagger } from "@gateway/core/decorators/swagger/auth/follow.decorator";
import { GetFollowersSwagger } from "@gateway/core/decorators/swagger/auth/get-followers.decorator";
import { GetFollowingsSwagger } from "@gateway/core/decorators/swagger/auth/get-followings.decorator";
import { GetFollowQueryInputDto } from "@libs/contracts/auth-contracts/input/get-follow.query.input.dto";

@ApiTags(ApiTagsNames.USERS)
@Controller(UsersRouterPaths.USERS)
export class UsersClientController {
	constructor(private readonly usersClientService: UsersClientService) {}

	@GetUsersCountSwagger()
	@Get(UsersRouterPaths.USERS_COUNT)
	@HttpCode(HttpStatus.OK)
	async getUsersCount(): Promise<UsersCountOutputDto> {
		return await this.usersClientService.getUsersCount();
	}

	@GetUsersBySearchSwagger()
	@UseGuards(JwtAccessAuthGuard)
	@Get()
	@HttpCode(HttpStatus.OK)
	async getUsersBySearch(@Query() payload: SearchUsersInputDto): Promise<SearchUsersOutputWithAvatarDto> {
		return await this.usersClientService.getUsersBySearch(payload);
	}

	@FollowSwagger()
	@UseGuards(JwtAccessAuthGuard)
	@Post(UsersRouterPaths.FOLLOW)
	@HttpCode(HttpStatus.OK)
	async follow(@ExtractUserFromRequest() user: PayloadFromRequestDto, @Body() payload: FollowingInputDto): Promise<FollowingOutputDto> {
		return await this.usersClientService.follow({ currentUserId: user.userId, userId: payload.userId });
	}

	@UnfollowSwagger()
	@UseGuards(JwtAccessAuthGuard)
	@Post(UsersRouterPaths.UNFOLLOW)
	@HttpCode(HttpStatus.OK)
	async unfollow(@ExtractUserFromRequest() user: PayloadFromRequestDto, @Body() payload: FollowingInputDto): Promise<FollowingOutputDto> {
		return await this.usersClientService.unfollow({ currentUserId: user.userId, userId: payload.userId });
	}

	@GetFollowersSwagger()
	@UseGuards(JwtAccessAuthGuard)
	@Get(UsersRouterPaths.FOLLOWERS)
	@HttpCode(HttpStatus.OK)
	async getFollowers(@ExtractUserFromRequest() user: PayloadFromRequestDto, @Query() query: GetFollowQueryInputDto): Promise<GetFollowersOutputDto> {
		return await this.usersClientService.getFollowers(user.userId, query);
	}

	@GetFollowingsSwagger()
	@UseGuards(JwtAccessAuthGuard)
	@Get(UsersRouterPaths.FOLLOWINGS)
	@HttpCode(HttpStatus.OK)
	async getFollowings(@ExtractUserFromRequest() user: PayloadFromRequestDto, @Query() query: GetFollowQueryInputDto): Promise<GetFollowingsOutputDto> {
		return await this.usersClientService.getFollowings(user.userId, query);
	}
}

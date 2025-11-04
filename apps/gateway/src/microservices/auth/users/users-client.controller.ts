import { Controller, HttpCode, HttpStatus, Get, Query, UseGuards } from "@nestjs/common";
import { SearchUsersInputDto, SearchUsersOutputWithAvatarDto, UsersCountOutputDto } from "@libs/contracts/index";
import { ApiTags } from "@nestjs/swagger";
import { AuthRouterPaths, ApiTagsNames } from "@libs/constants/index";
import { GetUsersCountSwagger } from "@gateway/core/decorators/swagger/auth/get-users-count.decorator";
import { UsersClientService } from "./users-client.service";
import { GetUsersBySearchSwagger } from "@gateway/core/decorators/swagger/auth/get-users-by-search.decorator";
import { JwtAccessAuthGuard } from "@gateway/core/guards/jwt-access-auth.guard";

@ApiTags(ApiTagsNames.USERS)
@Controller(AuthRouterPaths.USERS)
export class UsersClientController {
	constructor(private readonly usersClientService: UsersClientService) {}

	@GetUsersCountSwagger()
	@Get(AuthRouterPaths.USERS_COUNT)
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
}

import { Controller, HttpCode, HttpStatus, UseGuards, Get, Delete, Param } from "@nestjs/common";
import { ApiTagsNames, SessionRouterPaths } from "@libs/constants/index";
import { ApiTags } from "@nestjs/swagger";
import { JwtAccessAuthGuard } from "@gateway/core/guards/jwt-access-auth.guard";
import { ExtractUserFromRequest } from "@gateway/core/decorators/param/extract-user-from-request";
import { PayloadFromRequestDto, SessionOutputDto } from "@libs/contracts/index";
import { SessionAuthClientService } from "./session-auth-clien.service";
import { GetSessionsSwagger } from "@gateway/core/decorators/swagger/devices/get-sessions.decorator";
import { LogoutSessionSwagger } from "@gateway/core/decorators/swagger/devices/logout-session.decorator";
import { LogoutOtherSessionsSwagger } from "@gateway/core/decorators/swagger/devices/logout-other-sessions.decorator";

@ApiTags(ApiTagsNames.SESSIONS)
@UseGuards(JwtAccessAuthGuard)
@Controller(SessionRouterPaths.SESSIONS)
export class SessionAuthClientController {
	constructor(private readonly sessionAuthClientService: SessionAuthClientService) {}

	@GetSessionsSwagger()
	@Get()
	@HttpCode(HttpStatus.OK)
	async getSessions(@ExtractUserFromRequest() user: PayloadFromRequestDto): Promise<SessionOutputDto> {
		const result = await this.sessionAuthClientService.getSessions(user);
		return result;
	}

	@LogoutSessionSwagger()
	@Delete(":deviceId")
	@HttpCode(HttpStatus.NO_CONTENT)
	async logoutSession(@ExtractUserFromRequest() user: PayloadFromRequestDto, @Param("deviceId") deviceId: string): Promise<void> {
		await this.sessionAuthClientService.logoutSession(user, deviceId);
		return;
	}

	@LogoutOtherSessionsSwagger()
	@Delete()
	@HttpCode(HttpStatus.NO_CONTENT)
	async logoutOtherSessions(@ExtractUserFromRequest() user: PayloadFromRequestDto): Promise<void> {
		await this.sessionAuthClientService.logoutOtherSessions(user);
		return;
	}
}

import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AuthMessages } from "@libs/constants/index";
import { ISessionQueryRepository } from "./session.interfaces";
import { PayloadFromRequestDto, SessionOutputDto } from "@libs/contracts/index";
import { SessionService } from "./session.service";

@Controller()
export class SessionController {
	constructor(
		private readonly sessionQueryRepository: ISessionQueryRepository,
		private readonly sessionService: SessionService,
	) {}

	@MessagePattern({ cmd: AuthMessages.GET_SESSIONS })
	async getSessions(@Payload() payload: { user: PayloadFromRequestDto }): Promise<SessionOutputDto> {
		return this.sessionQueryRepository.getSessions(payload.user);
	}

	@MessagePattern({ cmd: AuthMessages.LOGOUT_SESSION })
	async logoutSession(@Payload() payload: { userId: string; deviceId: string }): Promise<boolean> {
		return this.sessionService.deleteSession(payload.deviceId);
	}

	@MessagePattern({ cmd: AuthMessages.LOGOUT_OTHER_SESSIONS })
	async logoutOtherSessions(@Payload() payload: { user: PayloadFromRequestDto }): Promise<boolean> {
		return this.sessionService.deleteOtherSessions(payload.user);
	}
}

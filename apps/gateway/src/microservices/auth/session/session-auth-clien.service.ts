import { Inject, Injectable } from "@nestjs/common";
import { AuthMessages, Microservice } from "@libs/constants/index";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { PayloadFromRequestDto, SessionOutputDto } from "@libs/contracts/index";

@Injectable()
export class SessionAuthClientService {
	constructor(@Inject(Microservice.AUTH) private readonly client: ClientProxy) {}

	async getSessions(user: PayloadFromRequestDto): Promise<SessionOutputDto> {
		const sessions = await firstValueFrom(this.client.send({ cmd: AuthMessages.GET_SESSIONS }, { user }));
		return sessions;
	}

	async logoutSession(user: PayloadFromRequestDto, deviceId: string): Promise<void> {
		await firstValueFrom(this.client.send({ cmd: AuthMessages.LOGOUT_SESSION }, { userId: user.userId, deviceId }));
	}

	async logoutOtherSessions(user: PayloadFromRequestDto): Promise<void> {
		await firstValueFrom(this.client.send({ cmd: AuthMessages.LOGOUT_OTHER_SESSIONS }, { user }));
	}
}

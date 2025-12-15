import { Inject, Injectable } from "@nestjs/common";
import { AuthMessages, Microservice } from "@libs/constants/index";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { PayloadFromRequestDto, SessionOutputDto } from "@libs/contracts/index";
import { RedisService } from "@libs/redis/redis.service";

@Injectable()
export class SessionAuthClientService {
	constructor(
		@Inject(Microservice.AUTH) private readonly client: ClientProxy,
		private readonly redisService: RedisService,
	) {}

	async getSessions(user: PayloadFromRequestDto): Promise<SessionOutputDto> {
		const sessions = await firstValueFrom(this.client.send({ cmd: AuthMessages.GET_SESSIONS }, { user }));
		return sessions;
	}

	async logoutSession(user: PayloadFromRequestDto, deviceId: string): Promise<void> {
		const result = await firstValueFrom(this.client.send({ cmd: AuthMessages.LOGOUT_SESSION }, { userId: user.userId, deviceId }));
		console.log("Deleted session: ", result);
		await this.redisService.del(`access_token:${deviceId}`);
	}

	async logoutOtherSessions(user: PayloadFromRequestDto): Promise<void> {
		const result = await firstValueFrom(this.client.send({ cmd: AuthMessages.LOGOUT_OTHER_SESSIONS }, { user }));
		console.log("Deleted other sessions: ", result);
		for (const deviceId of result) {
			await this.redisService.del(`access_token:${deviceId}`);
		}
	}
}

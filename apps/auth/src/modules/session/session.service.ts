import { Injectable, Inject } from "@nestjs/common";
import { ISessionCommandRepository } from "@auth/modules/session/session.interfaces";
import { PayloadFromRequestDto, SessionMetadataDto } from "@libs/contracts/index";
import { SessionInputRepoDto } from "@auth/modules/session/dto/session-repo.input.dto";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class SessionService {
	constructor(
		@Inject(ISessionCommandRepository)
		private readonly sessionCommandRepository: ISessionCommandRepository,
	) {}

	async createSession(userId: string, deviceId: string, metadata: SessionMetadataDto, payloadFromJwt: any): Promise<void> {
		const newSession: SessionInputRepoDto = {
			deviceId,
			userId,
			deviceName: metadata.device.browser,
			iat: new Date(payloadFromJwt.iat * 1000),
			exp: new Date(payloadFromJwt.exp * 1000),
			ip: metadata.device.ip,
			country: metadata.location.country,
			city: metadata.location.city,
			latitude: metadata.location.latitude,
			longitude: metadata.location.longitude,
			timezone: metadata.location.timezone,
			browser: metadata.device.browser,
			os: metadata.device.os,
			type: metadata.device.type,
			userAgent: metadata.device.userAgent,
		};

		await this.sessionCommandRepository.createSession(newSession);
		return;
	}

	async updateSession(deviceId: string, payloadFromJwt: any) {
		const updatedSession = {
			exp: new Date(payloadFromJwt.exp * 1000),
			iat: new Date(payloadFromJwt.iat * 1000),
		};
		await this.sessionCommandRepository.updateSession(deviceId, updatedSession);
	}

	async deleteSession(deviceId: string): Promise<boolean> {
		const session = await this.sessionCommandRepository.findSessionByDeviceId(deviceId);
		if (!session) {
			throw new NotFoundRpcException("Session not found");
		}
		return await this.sessionCommandRepository.deleteSession(deviceId);
	}
	async deleteOtherSessions(user: PayloadFromRequestDto): Promise<boolean> {
		const { userId, deviceId } = user;
		return await this.sessionCommandRepository.deleteOtherSessions(userId, deviceId);
	}

	async deleteAllSessions(userId: string): Promise<boolean> {
		return await this.sessionCommandRepository.deleteAllSessions(userId);
	}

	@Cron(CronExpression.EVERY_HOUR)
	async deleteExpiredSessions() {
		await this.sessionCommandRepository.deleteExpiredSessions();
	}
}

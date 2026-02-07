import { PrismaService } from "@auth/core/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { ISessionQueryRepository } from "@auth/modules/session/session.interfaces";
import { PayloadFromRequestDto, SessionDto, SessionOutputDto } from "@libs/contracts/index";

@Injectable()
export class PrismaSessionQueryRepository implements ISessionQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findSessionByTokenData(payload: any) {
		const session = await this.prisma.session.findUnique({
			where: {
				deviceId: payload.deviceId,
				iat: new Date(payload.iat * 1000),
				exp: new Date(payload.exp * 1000),
				deletedAt: null,
			},
		});
		return session;
	}

	async getSessions(user: PayloadFromRequestDto): Promise<SessionOutputDto> {
		const sessions = await this.prisma.session.findMany({
			where: { userId: user.userId, deletedAt: null },
			select: {
				deviceId: true,
				deviceName: true,
				ip: true,
				country: true,
				city: true,
				latitude: true,
				longitude: true,
				timezone: true,
				browser: true,
				os: true,
				type: true,
				createdAt: true,
			},
		});

		const currentSession = sessions.find((session) => session.deviceId === user.deviceId);
		const otherSessions = sessions.filter((session) => session.deviceId !== user.deviceId);
		return {
			currentSession: currentSession as SessionDto,
			otherSessions,
		};
	}
}

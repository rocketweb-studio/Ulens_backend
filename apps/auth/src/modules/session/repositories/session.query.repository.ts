import { PrismaService } from "@auth/core/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { ISessionQueryRepository } from "@auth/modules/session/session.interfaces";

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
}

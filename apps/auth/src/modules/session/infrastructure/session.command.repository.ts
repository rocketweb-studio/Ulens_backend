import { PrismaService } from "@auth/core/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { ISessionCommandRepository } from "@auth/modules/session/session.interfaces";
import { SessionInputRepoDto } from "@auth/modules/session/dto/session-repo.input.dto";

@Injectable()
export class PrismaSessionCommandRepository implements ISessionCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findSessionByDeviceId(deviceId: string): Promise<string | null> {
		const session = await this.prisma.session.findUnique({
			where: { deviceId, deletedAt: null },
			select: {
				deviceId: true,
			},
		});

		return session?.deviceId || null;
	}

	async createSession(sessionDto: SessionInputRepoDto): Promise<void> {
		await this.prisma.session.create({
			data: sessionDto,
		});
		return;
	}

	async deleteSession(deviceId: string): Promise<boolean> {
		const session = await this.prisma.session.update({
			where: { deviceId, deletedAt: null },
			data: { deletedAt: new Date() },
		});
		return !!session;
	}

	async updateSession(deviceId: string, payload: { exp: Date; iat: Date }) {
		await this.prisma.session.update({
			where: { deviceId },
			data: payload,
		});
	}

	async deleteOtherSessions(userId: string, deviceId: string): Promise<boolean> {
		const result = await this.prisma.session.updateMany({
			where: { userId, deletedAt: null, deviceId: { not: deviceId } },
			data: { deletedAt: new Date() },
		});
		return result.count >= 0;
	}

	async deleteAllSessions(userId: string): Promise<boolean> {
		const result = await this.prisma.session.updateMany({
			where: { userId, deletedAt: null },
			data: { deletedAt: new Date() },
		});
		return result.count >= 0;
	}

	async deleteExpiredSessions(): Promise<boolean> {
		const result = await this.prisma.session.updateMany({
			where: { exp: { lt: new Date() }, deletedAt: null },
			data: { deletedAt: new Date() },
		});
		return result.count >= 0;
	}
}

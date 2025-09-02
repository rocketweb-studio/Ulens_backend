import { PrismaService } from "@auth/core/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { ISessionCommandRepository } from "@auth/modules/session/session.interfaces";
import { SessionInputRepoDto } from "@auth/modules/session/dto/session-repo.input.dto";

@Injectable()
export class PrismaSessionCommandRepository implements ISessionCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createSession(sessionDto: SessionInputRepoDto): Promise<void> {
		await this.prisma.session.create({
			data: sessionDto,
		});
		return;
	}

	async deleteSession(deviceId: string) {
		const session = await this.prisma.session.update({
			where: { deviceId },
			data: { deletedAt: new Date() },
		});
		return session;
	}

	async updateSession(deviceId: string, payload: { exp: Date; iat: Date }) {
		await this.prisma.session.update({
			where: { deviceId },
			data: payload,
		});
	}

	async deleteSessions(userId: string) {
		await this.prisma.session.updateMany({
			where: { userId },
			data: { deletedAt: new Date() },
		});
	}
}

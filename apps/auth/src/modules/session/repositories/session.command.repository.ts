import { PrismaService } from "@auth/core/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { UUID } from "crypto";
import { ISessionCommandRepository } from "../session.interfaces";
import { SessionInputRepoDto } from "../dto/session-input-repo.dto";

@Injectable()
export class PrismaSessionCommandRepository implements ISessionCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createSession(sessionDto: SessionInputRepoDto): Promise<void> {
		await this.prisma.session.create({
			data: sessionDto,
		});
		return;
	}

	async deleteSession(deviceId: UUID) {
		const session = await this.prisma.session.update({
			where: { deviceId },
			data: { deletedAt: new Date() },
		});
		return session;
	}

	async updateSession(deviceId: UUID, payload: { exp: Date; iat: Date }) {
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

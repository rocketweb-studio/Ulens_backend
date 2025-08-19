import { PrismaService } from '@auth/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { ISessionCommandRepository } from '../session.interfaces';

@Injectable()
export class PrismaSessionCommandRepository implements ISessionCommandRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(payload: any) {
    const session = await this.prisma.session.create({
      data: payload
    });
    return session;
  }

  async deleteSession(deviceId: UUID) {
    const session = await this.prisma.session.update({
      where: { deviceId },
      data: { deletedAt: new Date() }
    });
    return session;
  }

  async updateSession(deviceId: UUID, payload: { exp: Date; iat: Date }) {
    await this.prisma.session.update({
      where: { deviceId },
      data: payload
    });
  }
}

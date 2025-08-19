import { Injectable, Inject } from '@nestjs/common';
import { ISessionCommandRepository } from './session.interfaces';
import { UUID } from 'crypto';
import { SessionMetadataDto } from '@libs/contracts/index';

@Injectable()
export class SessionService {
  constructor(
    @Inject(ISessionCommandRepository) 
    private readonly sessionCommandRepository: ISessionCommandRepository
  ) {}

  async createSession(userId: UUID, deviceId: UUID, metadata: SessionMetadataDto, payloadFromJwt: any) {
    // TODO: add device name, ip, etc.
    const newSession = {
      deviceId,
      userId,
      deviceName: metadata.device.browser,
      iat: new Date(payloadFromJwt.iat * 1000),
      exp: new Date(payloadFromJwt.exp * 1000),
      ip: metadata.device.ip
    };

    const session = await this.sessionCommandRepository.createSession(newSession);
    return session;
  }

  async updateSession(deviceId: UUID, payloadFromJwt: any) {
    const updatedSession = {
      exp: new Date(payloadFromJwt.exp * 1000),
      iat: new Date(payloadFromJwt.iat * 1000)
    };
    await this.sessionCommandRepository.updateSession(deviceId, updatedSession);
  }

  async deleteSession(deviceId: UUID): Promise<any> {
    return await this.sessionCommandRepository.deleteSession(deviceId);
  }
}

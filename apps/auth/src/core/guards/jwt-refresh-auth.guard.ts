//* вместо passport.js, мы не можем использовать passport для RPC

import { ISessionQueryRepository } from '@auth/modules/session/session.interfaces';
import { IUserQueryRepository } from '@auth/modules/user/user.interfaces';
import { UnauthorizedRpcException } from '@libs/exeption/rpc-exeption';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtRefreshAuthGuard implements CanActivate {
  constructor(
    private readonly userQueryRepository: IUserQueryRepository,
    private readonly sessionQueryRepository: ISessionQueryRepository,
    private readonly jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const dataFromRpc = context.switchToRpc().getData<{ refreshToken: string }>();
    let payload: any;
    try {
      payload = this.jwtService.verify(dataFromRpc.refreshToken);
    } catch (e) {
      console.log(e.message);
      throw new UnauthorizedRpcException();
    }

    const user = await this.userQueryRepository.findUserById(payload.userId);
    if (!user) {
      throw new UnauthorizedRpcException();
    }

    const session = await this.sessionQueryRepository.findSessionByTokenData(payload);
    if (!session) {
      throw new UnauthorizedRpcException();
    }

    const userData = Object.entries(user);
    userData.forEach(([key, value]) => {
      dataFromRpc[key] = value;
    });

    (dataFromRpc as any).userId = payload.userId;
    (dataFromRpc as any).deviceId = payload.deviceId;

    return true;
  }
}

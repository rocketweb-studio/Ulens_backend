import { configValidationUtility } from '@/utils/env-validation.utility';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';

@Injectable()
export class AuthClientEnvConfig {
  @IsString()
  @IsNotEmpty({
    message: 'Set Env variable AUTH_CLIENT_HOST, example: localhost'
  })
  authClientHost: string;

  @IsString()
  @IsNotEmpty({
    message: 'Set Env variable AUTH_CLIENT_PORT, example: 3001'
  })
  authClientPort: number;

  constructor(private configService: ConfigService<any, true>) {
    this.authClientHost = this.configService.get<string>('AUTH_CLIENT_HOST');
    this.authClientPort = this.configService.get<number>('AUTH_CLIENT_PORT');

    configValidationUtility.validateConfig(this);
  }
}

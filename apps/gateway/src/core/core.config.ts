import { configValidationUtility } from '@/utils/env-validation.utility';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';

export enum Environments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TESTING = 'testing'
}

@Injectable()
export class CoreEnvConfig {
  @IsNotEmpty({
    message: 'Set Env variable PORT, example: 3000'
  })
  applicationPort: number;

  @IsString()
  @IsNotEmpty({
    message: 'Set Env variable AUTH_SERVICE_HOST, example: localhost'
  })
  authServiceHost: string;

  @IsString()
  @IsNotEmpty({
    message: 'Set Env variable AUTH_SERVICE_PORT, example: 3001'
  })
  authServicePort: string;

  constructor(private configService: ConfigService<any, true>) {
    this.applicationPort = this.configService.get<number>('PORT');
    this.authServiceHost = this.configService.get<string>('AUTH_SERVICE_HOST');
    this.authServicePort = this.configService.get<string>('AUTH_SERVICE_PORT');

    configValidationUtility.validateConfig(this);
  }
}

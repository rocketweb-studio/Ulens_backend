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

// each module has it's own *.config.ts

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

  // ? по идее authServicePort должен быть number, но тогда ругается валидация
  @IsString()  // ? @IsNumber()
  @IsNotEmpty({
    message: 'Set Env variable AUTH_SERVICE_PORT, example: 3001'
  })
  authServicePort: string; // ? authServicePort: number;

  constructor(private configService: ConfigService<any, true>) {
    this.applicationPort = this.configService.get<number>('PORT');
    this.authServiceHost = this.configService.get<string>('AUTH_SERVICE_HOST');
    this.authServicePort = this.configService.get<string>('AUTH_SERVICE_PORT'); // ? <number>

    configValidationUtility.validateConfig(this);
  }
}

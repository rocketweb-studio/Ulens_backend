/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { configValidationUtility } from '../utils/env-validation.utility';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';

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

  constructor(private configService: ConfigService<any, true>) {
    this.applicationPort = this.configService.get<number>('PORT');

    configValidationUtility.validateConfig(this);
  }
}

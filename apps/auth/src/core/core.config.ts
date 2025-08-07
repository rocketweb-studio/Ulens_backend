import { configValidationUtility } from '@/utils/env-validation.utility';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';

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

  @IsNotEmpty({
    message: 'Set Env variable DATABASE_URL, example: postgresql://user:password@host:port/database'
  })
  databaseUrl: string;

  constructor(private configService: ConfigService<any, true>) {
    this.applicationPort = this.configService.get<number>('PORT');
    this.databaseUrl = this.configService.get<string>('POSTGRES_URL');

    configValidationUtility.validateConfig(this);
  }
}

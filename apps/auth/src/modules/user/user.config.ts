import { configValidationUtility } from '@libs/utils/env-validation.utility';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';

@Injectable()
export class UserEnvConfig {
  @IsString()
  @IsNotEmpty({
    message: 'Set Env variable REFRESH_EXPIRES_IN, example: 1h'
  })
  refreshTokenExpirationTime: string;

  @IsString()
  @IsNotEmpty({
    message: 'Set Env variable REFRESH_SECRET_KEY, example: secret'
  })
  refreshTokenSecret: string;

  constructor(private configService: ConfigService<any, true>) {
    this.refreshTokenExpirationTime = this.configService.get<string>('REFRESH_EXPIRES_IN');
    this.refreshTokenSecret = this.configService.get<string>('REFRESH_SECRET_KEY');

    configValidationUtility.validateConfig(this);
  }
}

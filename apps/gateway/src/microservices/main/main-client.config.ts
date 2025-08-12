import { configValidationUtility } from '@libs/utils/env-validation.utility';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';

@Injectable()
export class MainClientEnvConfig {
  @IsString()
  @IsNotEmpty({
    message: 'Set Env variable MAIN_CLIENT_HOST, example: localhost'
  })
  mainClientHost: string;

  @IsString()
  @IsNotEmpty({
    message: 'Set Env variable MAIN_CLIENT_PORT, example: 3002'
  })
  mainClientPort: number;

  constructor(private configService: ConfigService<any, true>) {
    this.mainClientHost = this.configService.get<string>('MAIN_CLIENT_HOST');
    this.mainClientPort = this.configService.get<number>('MAIN_CLIENT_PORT');

    configValidationUtility.validateConfig(this);
  }
}

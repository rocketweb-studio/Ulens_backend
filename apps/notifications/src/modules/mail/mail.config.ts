import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { configValidationUtility } from '@libs/utils/env-validation.utility';

@Injectable()
export class MailConfig {
  @IsNumber(
    {},
    {
      message: 'Set Env variable SMTP_PORT, example: 587'
    }
  )
  smtp_port: number;

  @IsNotEmpty({
    message: 'Set Env variable SMTP_HOST, example: smtp.test.com'
  })
  smtp_host: string;

  @IsNotEmpty({
    message: 'Set Env variable SMTP_USER, example: test@gmail.com'
  })
  smtp_user: string;

  @IsNotEmpty({
    message: 'Set Env variable SMTP_PASSWORD, example: test test test test'
  })
  smtp_password: string;

  @IsString()
  @IsNotEmpty({
    message: 'Set Env variable FRONTEND_URL, example: http://localhost:3000'
  })
  frontendUrl: string;

  constructor(private configService: ConfigService<any, true>) {
    this.smtp_port = Number(this.configService.get('SMTP_PORT'));
    this.smtp_host = this.configService.get('SMTP_HOST');
    this.smtp_user = this.configService.get('SMTP_USER');
    this.smtp_password = this.configService.get('SMTP_PASSWORD');
    this.frontendUrl = this.configService.get('FRONTEND_URL');

    configValidationUtility.validateConfig(this);
  }
}

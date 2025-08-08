import { configValidationUtility } from '@/utils/env-validation.utility';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum Environments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TESTING = 'testing'
}

// each module has it's own *.config.ts

@Injectable()
export class CoreEnvConfig {
  @IsEnum(Environments, {
    message: 'Ser correct NODE_ENV value, available values: ' + configValidationUtility.getEnumValues(Environments).join(', ')
  })
  env: string;

  @IsNotEmpty({
    message: 'Set Env variable TCP_HOST, example: 0.0.0.0'
  })
  tcpHost: string;

  @IsNotEmpty({
    message: 'Set Env variable TCP_PORT, example: 3001'
  })
  tcpPort: number;

  constructor(private configService: ConfigService<any, true>) {
    this.env = this.configService.get('NODE_ENV'); // 1
    this.tcpHost = this.configService.get<string>('TCP_HOST');
    this.tcpPort = this.configService.get<number>('TCP_PORT');

    configValidationUtility.validateConfig(this); // 2
  }
}

/**
 *  Описывает и валидирует структуру конфигурации, например applicationPort, env, dbUrl и тд
 * 1.Получаем переменные окружения через ConfigService
 * 2.Утилита configValidationUtility валидирует поля
 *    const errors = validateSync(config);
 *    validateSync() — это метод из пакета class-validator, и он работает строго на основе декораторов, которые были созданы
 *      в нашем классе CoreEnvConfig с полями и декораторами @IsNotEmpty(), @IsEnum() и т.д.
 *  process.env напрямую не используется в этом файле, потому что NestJS использует обёртку ConfigService из модуля @nestjs/config.
 *    ConfigService.get('PORT') — это и есть обёртка вокруг process.env.PORT.
 */

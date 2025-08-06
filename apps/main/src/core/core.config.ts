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
  @IsNotEmpty({
    message: 'Set Env variable PORT, example: 3000'
  })
  applicationPort: number;

  @IsEnum(Environments, {
    message: 'Ser correct NODE_ENV value, available values: ' + configValidationUtility.getEnumValues(Environments).join(', ')
  })
  env: string;

  constructor(private configService: ConfigService<any, true>) {
    this.applicationPort = this.configService.get<number>('PORT');  // 1
    this.env = this.configService.get('NODE_ENV'); // 1

    configValidationUtility.validateConfig(this);   // 2
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

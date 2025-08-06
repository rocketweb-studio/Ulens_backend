import { configValidationUtility } from '@/utils/env-validation.utility';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';

/**
 * конфигурация окружения для модуля mock
 * Этот файл просто дял примера. В модулях с простой бизнес логикой не будет этого файла.
 * Такие файлы будут использоваться только для сторонних библиотек Prisma, GraphQL и тд
 */
@Injectable()
export class MockEnvConfig {
  //  проверка на наличие переменной окружения MOCK_ENV
  @IsNotEmpty({
    message: 'Set Env variable MOCK_ENV, example: mock'
  })
  mockEnv: string;

  constructor(private configService: ConfigService<any, true>) {
    this.mockEnv = this.configService.get<string>('MOCK_ENV');

    configValidationUtility.validateConfig(this);
  }
}

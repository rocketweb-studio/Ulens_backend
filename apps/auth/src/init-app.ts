/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { CoreEnvConfig } from './core/core-env.config';
import { DynamicModule } from '@nestjs/common';

export const initAppModule = async (): Promise<DynamicModule> => {
  // Делаем это для того, чтобы получить конфигурацию из переменных окружения и донастроить модуль AppModule до его запуска
  const appContext = await NestFactory.createApplicationContext(AuthModule);
  const config = appContext.get<CoreEnvConfig>(CoreEnvConfig);
  await appContext.close();

  return AuthModule.forRoot(config);
};

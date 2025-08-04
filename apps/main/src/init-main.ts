import { NestFactory } from '@nestjs/core';
import { MainModule } from '@/main.module';
import { CoreEnvConfig } from '@/core/core-env.config';
import { DynamicModule } from '@nestjs/common';

//  Динамический модуль, для того чтобы можно было использовать разные модули в зависимости от окружения
export const initMainModule = async (): Promise<DynamicModule> => {
  const appContext = await NestFactory.createApplicationContext(MainModule);
  const config = appContext.get<CoreEnvConfig>(CoreEnvConfig);
  await appContext.close();

  return MainModule.forRoot(config);
};

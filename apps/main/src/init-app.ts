import { NestFactory } from '@nestjs/core';
import { MainModule } from '@/main.module';
import { CoreEnvConfig } from '@/core/core-env.config';
import { DynamicModule } from '@nestjs/common';

export const initAppModule = async (): Promise<DynamicModule> => {
  const appContext = await NestFactory.createApplicationContext(MainModule);
  const config = appContext.get<CoreEnvConfig>(CoreEnvConfig);
  await appContext.close();

  return MainModule.forRoot(config);
};

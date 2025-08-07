import { NestFactory } from '@nestjs/core';
import { AuthModule } from '@/auth.module';
import { CoreEnvConfig } from '@/core/core.config';
import { DynamicModule } from '@nestjs/common';

export const initAppModule = async (): Promise<DynamicModule> => {
  const appContext = await NestFactory.createApplicationContext(AuthModule);
  const config = appContext.get<CoreEnvConfig>(CoreEnvConfig);
  await appContext.close();

  return AuthModule.forRoot(config);
};

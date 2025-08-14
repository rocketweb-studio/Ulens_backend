import { NestFactory } from '@nestjs/core';
import { DynamicModule } from '@nestjs/common';
import { CoreEnvConfig } from '@/core/core.config';
import { GatewayModule } from '@/gateway.module';

export const initGatewayModule = async (): Promise<DynamicModule> => {
  const appContext = await NestFactory.createApplicationContext(GatewayModule);
  const config = appContext.get<CoreEnvConfig>(CoreEnvConfig);
  await appContext.close();

  // useContainer(appContext.select(GatewayModule), { fallbackOnErrors: true });

  return GatewayModule.forRoot(config);
};

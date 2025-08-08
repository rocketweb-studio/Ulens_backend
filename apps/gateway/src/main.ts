import { NestFactory } from '@nestjs/core';
import { CoreEnvConfig } from './core/core.config';
import { initGatewayModule } from './init-app';

async function bootstrap() {
  const dynamicAppModule = await initGatewayModule();

  const app = await NestFactory.create(dynamicAppModule);
  const config = app.get<CoreEnvConfig>(CoreEnvConfig);

  app.setGlobalPrefix('api/v1');

  await app.listen(config.applicationPort);
  console.log(`Gateway service is running port:${config.applicationPort}`)
}
bootstrap();

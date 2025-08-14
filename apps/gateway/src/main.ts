import { NestFactory } from '@nestjs/core';
import { CoreEnvConfig } from '@/core/core.config';
import { initGatewayModule } from '@/init-app';
import { configApp } from './gateway.setup';

async function bootstrap() {
  const dynamicAppModule = await initGatewayModule();

  const app = await NestFactory.create(dynamicAppModule);
  const config = app.get<CoreEnvConfig>(CoreEnvConfig);

  configApp(app, config);
  await app.listen(config.applicationPort);
  console.log(`Gateway is running on port ${config.applicationPort}`);
}
bootstrap();

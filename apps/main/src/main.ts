import { NestFactory } from '@nestjs/core';
import { CoreEnvConfig } from '@/core/core-env.config';
import { initMainModule } from '@/init-main';
import { configApp } from './main.setup';

async function bootstrap() {
  const dynamicAppModule = await initMainModule();

  const app = await NestFactory.create(dynamicAppModule);
  const config = app.get<CoreEnvConfig>(CoreEnvConfig);

  configApp(app, config);

  await app.listen(config.applicationPort);
}
bootstrap();

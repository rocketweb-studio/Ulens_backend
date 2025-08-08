import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { initAppModule } from './init-app';
import { CoreEnvConfig } from './core/core.config';
import { configApp } from './app.setup';

async function bootstrap() {
  const dynamicAppModule = await initAppModule();

  const app = await NestFactory.createMicroservice(dynamicAppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3001 // TCP port for auth service
    }
  });

  // const config = app.get<CoreEnvConfig>(CoreEnvConfig);

  // configApp(app, config);

  await app.listen();
  console.log('Auth microservice is listening on port 3001');
}
bootstrap();

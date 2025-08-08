import { NestFactory } from '@nestjs/core';
import { initAppModule } from './init-app';
import { CoreEnvConfig } from './core/core-env.config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';


async function bootstrap() {
  const dynamicAppModule = await initAppModule();

  // const app = await NestFactory.create(dynamicAppModule);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(dynamicAppModule, {
    transport:Transport.TCP,
    options:{
      host:"127.0.0.1", // в кубере здесь должно быть имя микросервиса
      port: 8877
    }
  })

  // const config = app.get<CoreEnvConfig>(CoreEnvConfig);

  // await app.listen(config.applicationPort);
  await app.listen();
}
bootstrap();

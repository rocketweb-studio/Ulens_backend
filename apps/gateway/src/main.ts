import { NestFactory } from '@nestjs/core';
import { CoreEnvConfig } from '@/core/core.config';
import { initGatewayModule } from '@/init-app';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const dynamicAppModule = await initGatewayModule();

  const app = await NestFactory.create(dynamicAppModule);
  const config = app.get<CoreEnvConfig>(CoreEnvConfig);

  // Setting Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('RocketwebApp')
    .setDescription('The best API documentation ever!')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/swagger', app, document);

  //Setting Validation
  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true,            // отбрасывать лишние поля
  //   forbidNonWhitelisted: true, // ругаться на лишние поля
  //   transform: true,            // приводить типы (query/body) к DTO
  // }));

  app.setGlobalPrefix('api/v1');

  await app.listen(config.applicationPort);
  console.log(`Gateway is running on port ${config.applicationPort}`);
}
bootstrap();

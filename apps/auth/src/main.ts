import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3960);
}
bootstrap();

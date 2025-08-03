import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.setGlobalPrefix('backend-api');
  await app.listen(process.env.port ?? 3001);
}
bootstrap();

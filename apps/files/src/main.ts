import { NestFactory } from '@nestjs/core';
import { FilesModule } from '@/files.module';

async function bootstrap() {
  const app = await NestFactory.create(FilesModule);
  await app.listen(process.env.port ?? 3002);
}
bootstrap();

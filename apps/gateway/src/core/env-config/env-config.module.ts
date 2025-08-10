import { ConfigModule } from '@nestjs/config';

// MICROSERVICE_NAME NODE_ENV переменные добавляем в package.json в скриптах так как они не доступны до инициализации ConfigModule
export const configModule = ConfigModule.forRoot({
  envFilePath: [
    // local dev
    `apps/${process.env.MICROSERVICE_NAME}/.env.${process.env.NODE_ENV}.local`
  ],
  isGlobal: true
});

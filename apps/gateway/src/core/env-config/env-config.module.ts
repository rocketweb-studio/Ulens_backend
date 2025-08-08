import { ConfigModule } from '@nestjs/config';

export const configModule = ConfigModule.forRoot({
  envFilePath: [
    // local dev
    `apps/gateway/.env.${process.env.NODE_ENV}.local`
    // чтобы не забыть указывать микросервис, можно использовать переменную окружения MICROSERVICE_NAME
    //! `apps/${process.env.MICROSERVICE_NAME}/.env.${process.env.NODE_ENV}.local`
  ],
  isGlobal: true
});

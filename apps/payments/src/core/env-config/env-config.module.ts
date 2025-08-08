import { ConfigModule } from '@nestjs/config';

export const configModule = ConfigModule.forRoot({
  envFilePath: [
    // local dev
    `apps/payments/.env.${process.env.NODE_ENV}.local`,
    `.env.${process.env.NODE_ENV}`,
    '.env.production'
  ],
  isGlobal: true
});

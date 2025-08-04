import { ConfigModule } from '@nestjs/config';

export const configModule = ConfigModule.forRoot({
  envFilePath: [
    // lower priority
    `apps/auth/.env.${process.env.NODE_ENV}.local`,
    // lower priority
    `apps/auth/.env.${process.env.NODE_ENV}`,
    // lower priority
    'apps/auth/.env.production'
  ],
  isGlobal: true
});

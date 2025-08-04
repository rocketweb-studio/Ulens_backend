import { ConfigModule } from '@nestjs/config';

export const configModule = ConfigModule.forRoot({
  envFilePath: [
    // high priority
    ...(process.env.ENV_FILE_PATH ? [process.env.ENV_FILE_PATH.trim()] : []),
    // lower priority
    `.env.${process.env.NODE_ENV}.local`,
    // lower priority
    `.env.${process.env.NODE_ENV}`,
    // lower priority
    '.env.production'
  ],
  isGlobal: true
});

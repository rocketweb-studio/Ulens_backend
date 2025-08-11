import { configModule } from './env-config/env-config.module';
import { Module } from '@nestjs/common';
import { CoreEnvConfig } from './core.config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [configModule, PrismaModule],
  controllers: [],
  providers: [CoreEnvConfig],
  exports: [CoreEnvConfig]
})
export class CoreModule {}

import { configModule } from '@/core/env-config/env-config.module';
import { Module } from '@nestjs/common';
import { CoreEnvConfig } from '@/core/core.config';
import { PrismaModule } from '@/core/prisma/prisma.module';

@Module({
  imports: [configModule, PrismaModule],
  controllers: [],
  providers: [CoreEnvConfig],
  exports: [CoreEnvConfig]
})
export class CoreModule {}

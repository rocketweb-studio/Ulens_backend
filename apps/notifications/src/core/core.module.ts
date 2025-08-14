import { configModule } from '@/core/env-config/env-config.module';
import { Module } from '@nestjs/common';
import { CoreEnvConfig } from './core.config';

@Module({
  imports: [configModule],
  controllers: [],
  providers: [CoreEnvConfig],
  exports: [CoreEnvConfig]
})
export class CoreModule {}

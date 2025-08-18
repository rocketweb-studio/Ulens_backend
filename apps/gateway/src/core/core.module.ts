import { configModule } from './env-config/env-config.module';
import { Module } from '@nestjs/common';
import { CoreEnvConfig } from '@gateway/core/core.config';

@Module({
  imports: [configModule],
  controllers: [],
  providers: [CoreEnvConfig],
  exports: [CoreEnvConfig]
})
export class CoreModule {}

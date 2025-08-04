import { configModule } from '@/core/modules/env-config/env-config.module';
import { Module } from '@nestjs/common';

import { CoreEnvConfig } from './core-env.config';

@Module({
  imports: [configModule],
  controllers: [],
  providers: [CoreEnvConfig],
  exports: [CoreEnvConfig]
})
export class CoreModule {}

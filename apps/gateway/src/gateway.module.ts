import { DynamicModule, Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { CoreEnvConfig } from './core/core.config';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [GatewayController],
  providers: [GatewayService]
})
export class GatewayModule {
  static forRoot(config: CoreEnvConfig): DynamicModule {
    return {
      module: GatewayModule,
      providers: [
        {
          provide: CoreEnvConfig,
          useValue: config
        }
      ]
    };
  }
}

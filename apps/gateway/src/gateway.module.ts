import { DynamicModule, Module } from '@nestjs/common';
import { CoreEnvConfig } from '@/core/core.config';
import { CoreModule } from '@/core/core.module';
import { AuthClientModule } from '@/microservices/auth/auth-client.module';
import { MainClientModule } from '@/microservices/main/main-client.module';

@Module({
  imports: [CoreModule, AuthClientModule, MainClientModule],
  controllers: [],
  providers: []
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

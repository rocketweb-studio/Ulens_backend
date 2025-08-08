import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { CoreEnvConfig } from './core/core.config';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    CoreModule,
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        useFactory: (config: CoreEnvConfig) => ({
          transport: Transport.TCP,
          options: {
            host: config.authServiceHost,
            port: config.authServicePort
          }
        }),
        inject: [CoreEnvConfig],
        extraProviders: [CoreEnvConfig]
      }
    ])
  ],
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

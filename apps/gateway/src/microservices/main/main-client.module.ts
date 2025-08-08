import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MainClientEnvConfig } from './main-client.config';
import { MainClientController } from './main-client.controller';
import { MainClientService } from './main-client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'MAIN_SERVICE',
        useFactory: (config: MainClientEnvConfig) => ({
          transport: Transport.TCP,
          options: {
            host: config.mainClientHost,
            port: config.mainClientPort
          }
        }),
        inject: [MainClientEnvConfig],
        extraProviders: [MainClientEnvConfig]
      }
    ])
  ],
  controllers: [MainClientController],
  providers: [MainClientService, MainClientEnvConfig]
})
export class MainClientModule {}

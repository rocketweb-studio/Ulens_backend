import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthClientEnvConfig } from './auth-client.config';
import { AuthClientController } from './auth-client.controller';
import { AuthClientService } from './auth-client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        useFactory: (config: AuthClientEnvConfig) => ({
          transport: Transport.TCP,
          options: {
            host: config.authClientHost,
            port: config.authClientPort
          }
        }),
        inject: [AuthClientEnvConfig],
        extraProviders: [AuthClientEnvConfig]
      }
    ])
  ],
  controllers: [AuthClientController],
  providers: [AuthClientService, AuthClientEnvConfig]
})
export class AuthClientModule {}

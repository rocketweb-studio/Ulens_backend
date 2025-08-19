import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthClientEnvConfig } from '@gateway/microservices/auth/auth-client.config';
import { AuthClientController } from '@gateway/microservices/auth/auth-client.controller';
import { AuthClientService } from '@gateway/microservices/auth/auth-client.service';
import { Microservice } from '@libs/constants/microservices';
import { NotificationsClientModule } from '../notifications/notifications-client.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: Microservice.AUTH,
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
    ]),
    JwtModule.registerAsync({
      useFactory: (authEnvConfig: AuthClientEnvConfig) => ({
        secret: authEnvConfig.accessTokenSecret
      }),
      inject: [AuthClientEnvConfig],
      extraProviders: [AuthClientEnvConfig]
    }),
    NotificationsClientModule
  ],
  controllers: [AuthClientController],
  providers: [AuthClientService, AuthClientEnvConfig]
})
export class AuthClientModule {}

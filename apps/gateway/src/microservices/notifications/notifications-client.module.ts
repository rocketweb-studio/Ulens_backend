import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Microservice } from '@libs/constants/microservices';
import { NotificationsClientEnvConfig } from './notifications-client.config';
import { NotificationsClientService } from './notifications-client.service';
import { NotificationsClientController } from './notifications-client.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: Microservice.NOTIFICATIONS,
        useFactory: (config: NotificationsClientEnvConfig) => ({
          transport: Transport.TCP,
          options: {
            host: config.notificationsClientHost,
            port: config.notificationsClientPort
          }
        }),
        inject: [NotificationsClientEnvConfig],
        extraProviders: [NotificationsClientEnvConfig]
      }
    ])
  ],
  controllers: [NotificationsClientController],
  providers: [NotificationsClientService, NotificationsClientEnvConfig],
  exports:[NotificationsClientService]
})
export class NotificationsClientModule {}

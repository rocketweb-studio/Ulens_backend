import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [ClientsModule.register([
        {
          name:"AUTH-SERVICE",
          transport: Transport.TCP,
          options: {
            host: '127.0.0.1', // в кубере здесь должно быть имя сервиса
            port: 8877,
          }
        },
      ]),
  ],
  controllers: [AuthController],
  providers: []
})
export class AuthModule {}

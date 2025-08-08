import { CoreEnvConfig } from '../../core/core.config';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [ClientsModule.register([
    {
      name: "AUTH-SERVICE",
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1', // в кубере здесь должно быть имя сервиса
        port: 3001,
      }
      // ? если пытаюсь использовать закомментированный ниже вариант то при запросе падает 500 ошибка
      //@ts-ignore
      // useFactory: (config: CoreEnvConfig) => ({
      //   transport: Transport.TCP,
      //   options: {
      //     host: config.authServiceHost,
      //     port: config.authServicePort
      //   }
      // }),
      // inject: [CoreEnvConfig],
      // extraProviders: [CoreEnvConfig]
    },
  ]),
  ],
  controllers: [AuthController],
  providers: []
})
export class AuthModule { }

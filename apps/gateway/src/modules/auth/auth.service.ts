import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { IAuthService } from "./auth.interface";

@Injectable()
export class AuthService implements IAuthService {
  constructor(@Inject('AUTH-SERVICE') private readonly client: ClientProxy) {}

  login(data: { username: string; password: string }) {
    return firstValueFrom(this.client.send('auth-login', data));
    /**
         * 1.Вызываем метод send потомы что мы хотим получить ответ обратно (паттерн message)
         *  если ответ нам не нужен вызываем метод emit (паттерн event)
         * firstValueFrom функция из библиотеки RxJS, которая:
         *    -преобразует Observable в Promise
         *    -и возвращает только первое значение, которое придёт из потока (Observable).
         * В NestJS микросервисы общаются друг с другом через Observable, потому что библиотека @nestjs/microservices использует RxJS под капотом. 
         *  Метод send() у ClientProxy возвращает Observable, а не Promise
         *  Чтобы получить значение из этого Observable в асинхронной функции (async/await), 
         *      тебе нужно его преобразовать в Promise. Для этого используется firstValueFrom
         */
  }
}

/**
 *Интерфейс и этот сервис добавили чтобы в будующем можно было удобно перейти на gRPC
 *в будущем напишется новый сервис который реализует IAuthService интерфейс но для gRPC 
 *  и подставится в контроллер через DI
    
Пример:
    @Injectable()
    export class AuthClientService implements OnModuleInit {
      private authService: IAuthService;

      constructor(@Inject('AUTH-SERVICE') private readonly grpcClient: ClientGrpc) {}

      onModuleInit() {
        this.authService = this.grpcClient.getService<IAuthService>('AuthService');
      }

      login(data: { username: string; password: string }) {
        return lastValueFrom(this.authService.login(data));
      }
    }
 */
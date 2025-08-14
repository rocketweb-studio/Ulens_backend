import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IAuthClientService, CreateUserDto, BaseUserViewDto } from '@libs/contracts/index';
import { Microservice } from '@libs/constants/microservices';
import { AuthMessages } from '@libs/constants/auth-messages';
import { UnexpectedErrorRpcException } from '@libs/exeption/rpc-exeption';

@Injectable()
export class AuthClientService implements IAuthClientService {
  constructor(@Inject(Microservice.AUTH) private readonly client: ClientProxy) {}

  async getUsers(): Promise<BaseUserViewDto[]> {
    return firstValueFrom(this.client.send({ cmd: AuthMessages.GET_USERS }, {}));
  }

  async createUser(createUserDto: CreateUserDto): Promise<BaseUserViewDto> {
    try {
      const response = await firstValueFrom(this.client.send({ cmd: AuthMessages.CREATE_USER }, createUserDto));
      return response;
    } catch (e) {
      // можно использовать InternalServerErrorException и тогда будет использоваться фильтр для http ошибок
      throw new UnexpectedErrorRpcException(e.message);
    }
  }

  async registration(createUserDto: CreateUserDto): Promise<BaseUserViewDto> {
    return firstValueFrom(this.client.send({ cmd: AuthMessages.REGISTRATION }, createUserDto));
  }
}

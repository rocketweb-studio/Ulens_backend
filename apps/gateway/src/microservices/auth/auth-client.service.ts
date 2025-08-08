import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IAuthClientService, CreateUserDto, UserViewDto } from './auth-client.interface';

@Injectable()
export class AuthClientService implements IAuthClientService {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  async getUsers(): Promise<UserViewDto[]> {
    return firstValueFrom(this.client.send({ cmd: 'get_users' }, {}));
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserViewDto> {
    return firstValueFrom(this.client.send({ cmd: 'create_user' }, createUserDto));
  }
}

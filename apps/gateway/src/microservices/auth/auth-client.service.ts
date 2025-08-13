import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IAuthClientService, CreateUserDto, BaseUserViewDto } from '@libs/contracts/index';
import { Microservice } from '@libs/constants/microservices';
import { AuthMessages } from '@libs/constants/auth-messages';

@Injectable()
export class AuthClientService implements IAuthClientService {
  constructor(@Inject(Microservice.AUTH) private readonly client: ClientProxy) {}

  async getUsers(): Promise<BaseUserViewDto[]> {
    // throw new NotFoundException('test');
    return firstValueFrom(this.client.send({ cmd: AuthMessages.GET_USERS }, {}));
  }

  async createUser(createUserDto: CreateUserDto): Promise<BaseUserViewDto> {
    const response = await firstValueFrom(this.client.send({ cmd: AuthMessages.CREATE_USER }, createUserDto));
    return response;
  }
}

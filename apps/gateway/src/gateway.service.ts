import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GatewayService {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  async getUsers() {
    return firstValueFrom(this.client.send({ cmd: 'get_users' }, {}));
  }

  async createUser(createUserDto: any) {
    return firstValueFrom(this.client.send({ cmd: 'create_user' }, createUserDto));
  }

  getHello(): string {
    return 'Gateway is running!';
  }
}

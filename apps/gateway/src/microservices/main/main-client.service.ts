import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IMainClientService } from './main-client.interface';

@Injectable()
export class MainClientService implements IMainClientService {
  constructor(@Inject('MAIN_SERVICE') private readonly client: ClientProxy) {}
}

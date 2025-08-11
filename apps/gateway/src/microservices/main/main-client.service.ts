import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateSubscriptionDto, IMainClientService, SubscriptionViewDto } from '@/microservices/main/main-client.interface';
import { Microservice } from '@libs/constants/microservices';
import { firstValueFrom } from 'rxjs';
import { MainMessages } from '@libs/constants/main-messages';


@Injectable()
export class MainClientService implements IMainClientService {
  constructor(@Inject(Microservice.MAIN) private readonly client: ClientProxy) {}

  async getSubscriptions(): Promise<SubscriptionViewDto[]> {
    return firstValueFrom(this.client.send({ cmd: MainMessages.GET_SUBSCRIPTIONS }, {}));
  }

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto): Promise<SubscriptionViewDto> {
    return firstValueFrom(this.client.send({ cmd: MainMessages.CREATE_SUBSCRIPTION }, createSubscriptionDto));
  }
}

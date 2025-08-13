import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateSubscriptionDto, IMainClientService, BaseSubscriptionViewDto } from '@libs/contracts/index';
import { Microservice } from '@libs/constants/microservices';
import { firstValueFrom } from 'rxjs';
import { MainMessages } from '@libs/constants/main-messages';


@Injectable()
export class MainClientService implements IMainClientService {
  constructor(@Inject(Microservice.MAIN) private readonly client: ClientProxy) {}

  async getSubscriptions(): Promise<BaseSubscriptionViewDto[]> {
    return firstValueFrom(this.client.send({ cmd: MainMessages.GET_SUBSCRIPTIONS }, {}));
  }

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto): Promise<BaseSubscriptionViewDto> {
    return firstValueFrom(this.client.send({ cmd: MainMessages.CREATE_SUBSCRIPTION }, createSubscriptionDto));
  }
}

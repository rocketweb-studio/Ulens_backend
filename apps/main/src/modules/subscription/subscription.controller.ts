// for test microservices

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto} from '@libs/contracts/index';
import { MainMessages } from '@libs/constants/main-messages';

@Controller()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @MessagePattern({ cmd: MainMessages.GET_SUBSCRIPTIONS })
  async getSubscriptions() {
    return this.subscriptionService.getSubscriptions();
  }

  @MessagePattern({ cmd: MainMessages.CREATE_SUBSCRIPTION })
  async createSubscriptions(@Payload() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.createSubscription(createSubscriptionDto);
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { MainClientService } from '@gateway/microservices/main/main-client.service';
import { CreateSubscriptionDto, BaseSubscriptionViewDto } from '@libs/contracts/index';
import { RouterPaths } from '@libs/constants/index';

@Controller(RouterPaths.SUBSCRIPTIONS)
export class MainClientController {
  constructor(private readonly mainClientService: MainClientService) {}

  @Get()
  async getSubscriptions(): Promise<BaseSubscriptionViewDto[]>{
    return this.mainClientService.getSubscriptions();
  }

  @Post()
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto): Promise<BaseSubscriptionViewDto>{
    return this.mainClientService.createSubscription(createSubscriptionDto);
  }
}

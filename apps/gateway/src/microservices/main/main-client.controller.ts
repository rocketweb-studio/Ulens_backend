import { Body, Controller, Get, Post } from '@nestjs/common';
import { MainClientService } from '@/microservices/main/main-client.service';
import { CreateSubscriptionDto, SubscriptionViewDto } from './main-client.interface';
import { RouterPaths } from '@libs/constants/index';

@Controller(RouterPaths.SUBSCRIPTIONS)
export class MainClientController {
  constructor(private readonly mainClientService: MainClientService) {}

  @Get()
  async getSubscriptions(): Promise<SubscriptionViewDto[]>{
    return this.mainClientService.getSubscriptions();
  }

  @Post()
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto): Promise<SubscriptionViewDto>{
    return this.mainClientService.createSubscription(createSubscriptionDto);
  }
}

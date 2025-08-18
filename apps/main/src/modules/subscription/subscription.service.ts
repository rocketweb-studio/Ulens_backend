import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto, BaseSubscriptionViewDto } from '@libs/contracts/index';
import { PrismaService } from '@main/core/prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubscriptions() {
    const subscriptions = await this.prisma.subscription.findMany();
    return subscriptions;
  }

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    const subscription = await this.prisma.subscription.create({
      data: createSubscriptionDto
    });
    return BaseSubscriptionViewDto.mapToView(subscription);
  }
}

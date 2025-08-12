import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription-.dto';
import { BaseSubscriptionViewDto } from './dto/view-subscription.dto';
import { PrismaService } from '../../core/prisma/prisma.service';

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

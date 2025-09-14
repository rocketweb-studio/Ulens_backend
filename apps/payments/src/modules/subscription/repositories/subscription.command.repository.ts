import { Injectable } from "@nestjs/common";
import { PrismaService } from "@payments/core/prisma/prisma.service";
import { ISubscriptionCommandRepository } from "../subscription.interface";
import { SubscriptionCreateDto } from "../dto/subscription-create.dto";

@Injectable()
export class PrismaSubscriptionCommandRepository implements ISubscriptionCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createSubscription(subscription: SubscriptionCreateDto): Promise<string> {
		const createdSubscription = await this.prisma.subscription.create({ data: subscription });
		return createdSubscription.id;
	}

	async updateSubscription(id: string, data: any): Promise<boolean> {
		const updatedSubscription = await this.prisma.subscription.update({ where: { id }, data });
		return updatedSubscription.id !== null;
	}

	async getSubscriptionByUserId(userId: string): Promise<any> {
		const subscription = await this.prisma.subscription.findFirst({ where: { userId } });
		return subscription;
	}
}

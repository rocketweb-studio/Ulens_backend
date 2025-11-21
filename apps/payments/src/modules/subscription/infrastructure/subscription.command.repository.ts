import { Injectable } from "@nestjs/common";
import { PrismaService } from "@payments/core/prisma/prisma.service";
import { ISubscriptionCommandRepository } from "@payments/modules/subscription/subscription.interface";
import { SubscriptionCreateDto } from "@payments/modules/subscription/dto/subscription-create.dto";

@Injectable()
export class PrismaSubscriptionCommandRepository implements ISubscriptionCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createSubscription(subscription: SubscriptionCreateDto): Promise<number> {
		const createdSubscription = await this.prisma.subscription.create({ data: subscription });
		return createdSubscription.id;
	}

	async updateSubscription(id: number, data: any): Promise<boolean> {
		const updatedSubscription = await this.prisma.subscription.update({ where: { id, deletedAt: null }, data });
		return updatedSubscription.id !== null;
	}

	async getSubscriptionByUserId(userId: string): Promise<any> {
		const subscription = await this.prisma.subscription.findFirst({ where: { userId, deletedAt: null, expiresAt: { gt: new Date() } } });
		return subscription;
	}

	//todo дублирвоание методов для удаления
	async softDeleteUserSubscriptions(userId: string): Promise<void> {
		await this.prisma.subscription.updateMany({
			where: { userId },
			data: { deletedAt: new Date() },
		});
	}
	//todo дублирвоание методов для удаления
	async deleteSubscription(subscriptionId: number): Promise<boolean> {
		const deletedSubscription = await this.prisma.subscription.update({ where: { id: subscriptionId }, data: { deletedAt: new Date() } });
		return deletedSubscription.id !== null;
	}

	async deleteDeletedSubscriptions(): Promise<void> {
		const { count } = await this.prisma.subscription.deleteMany({
			where: { deletedAt: { not: null } },
		});
		console.log(`Deleted deleted subscriptions: [${count}]`);
	}
}

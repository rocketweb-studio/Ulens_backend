import { PrismaService } from "@payments/core/prisma/prisma.service";
import { ISubscriptionQueryRepository } from "../subscription.interface";
import { SubscriptionOutputDto } from "@libs/contracts/index";
import { Subscription } from "@payments/core/prisma/generated/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaSubscriptionQueryRepository implements ISubscriptionQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getSubscriptionByUserId(userId: string): Promise<SubscriptionOutputDto | null> {
		const subscription = await this.prisma.subscription.findFirst({
			where: { userId: userId, expiresAt: { gt: new Date() } },
		});
		return subscription ? this._mapSubscriptionToViewDto(subscription) : null;
	}

	private _mapSubscriptionToViewDto(subscription: Subscription): SubscriptionOutputDto {
		return {
			id: subscription.id,
			createdAt: subscription.createdAt,
			expiresAt: subscription.expiresAt,
			isAutoRenewal: subscription.isAutoRenewal,
		};
	}
}

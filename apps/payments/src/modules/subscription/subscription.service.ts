import { Injectable } from "@nestjs/common";
import { ISubscriptionCommandRepository } from "./subscription.interface";
import { SubscriptionCreateDto } from "./dto/subscription-create.dto";
import { BadRequestRpcException, NotFoundRpcException } from "@libs/exeption/rpc-exeption";
import { StripeService } from "@payments/core/stripe/stripe.service";

@Injectable()
export class SubscriptionService {
	constructor(
		private readonly subscriptionCommandRepository: ISubscriptionCommandRepository,
		private readonly stripeService: StripeService,
	) {}

	async createSubscription(subscription: SubscriptionCreateDto): Promise<string> {
		return await this.subscriptionCommandRepository.createSubscription(subscription);
	}

	async updateSubscription(id: string, data: any): Promise<boolean> {
		return await this.subscriptionCommandRepository.updateSubscription(id, data);
	}

	async getSubscriptionByUserId(userId: string): Promise<boolean> {
		return await this.subscriptionCommandRepository.getSubscriptionByUserId(userId);
	}

	async autoRenewalSubscription(userId: string, isAutoRenewal: boolean): Promise<boolean> {
		const subscription = await this.subscriptionCommandRepository.getSubscriptionByUserId(userId);
		if (!subscription) {
			throw new NotFoundRpcException("Subscription not found");
		}

		if (subscription.isAutoRenewal === isAutoRenewal) {
			throw new BadRequestRpcException("Auto renewal is already set to this value");
		}

		await this.stripeService.subscriptions.update(subscription.stripeSubscriptionId, {
			cancel_at_period_end: !isAutoRenewal,
		});

		return await this.subscriptionCommandRepository.updateSubscription(userId, { isAutoRenewal });
	}
}

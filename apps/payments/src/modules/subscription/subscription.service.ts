import { Injectable } from "@nestjs/common";
import { ISubscriptionCommandRepository } from "@payments/modules/subscription/subscription.interface";
import { SubscriptionCreateDto } from "@payments/modules/subscription/dto/subscription-create.dto";
import { BadRequestRpcException, NotFoundRpcException } from "@libs/exeption/rpc-exeption";
import { StripeService } from "@payments/core/stripe/stripe.service";
import { PayPalService } from "@payments/core/paypal/paypal.service";

@Injectable()
export class SubscriptionService {
	constructor(
		private readonly subscriptionCommandRepository: ISubscriptionCommandRepository,
		private readonly stripeService: StripeService,
		private readonly paypalService: PayPalService,
	) {}

	async createSubscription(subscription: SubscriptionCreateDto): Promise<number> {
		return await this.subscriptionCommandRepository.createSubscription(subscription);
	}

	async updateSubscription(id: string, data: any): Promise<boolean> {
		return await this.subscriptionCommandRepository.updateSubscription(+id, data);
	}

	async getSubscriptionByUserId(userId: string): Promise<any> {
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

		if (subscription.stripeSubscriptionId) {
			// если подписка в stripe, то обновляем статус подписки
			await this.stripeService.subscriptions.update(subscription.stripeSubscriptionId, {
				// если автопродление отключено, то отключаем автопродление
				cancel_at_period_end: !isAutoRenewal,
			});
			await this.subscriptionCommandRepository.updateSubscription(subscription.id, { isAutoRenewal });
		} else if (subscription.paypalSubscriptionId) {
			// если подписка в paypal, то отключаем автопродление
			if (isAutoRenewal) {
				await this.paypalService.activateSubscription(subscription.paypalSubscriptionId);
			} else {
				await this.paypalService.suspendSubscription(subscription.paypalSubscriptionId);
			}
		}
		return true;
	}

	async deleteSubscription(subscriptionId: string): Promise<boolean> {
		return await this.subscriptionCommandRepository.deleteSubscription(+subscriptionId);
	}
}

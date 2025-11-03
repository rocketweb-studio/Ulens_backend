import { SubscriptionOutputDto } from "@libs/contracts/index";
import { SubscriptionCreateDto } from "@payments/modules/subscription/dto/subscription-create.dto";

export abstract class ISubscriptionCommandRepository {
	abstract createSubscription(subscription: SubscriptionCreateDto): Promise<number>;
	abstract updateSubscription(id: number, data: any): Promise<boolean>;
	abstract getSubscriptionByUserId(userId: string): Promise<any>;
	abstract deleteSubscription(subscriptionId: number): Promise<boolean>;
	abstract deleteDeletedSubscriptions(): Promise<void>;
	abstract softDeleteUserSubscriptions(userId: string): Promise<void>;
}

export abstract class ISubscriptionQueryRepository {
	abstract getSubscriptionByUserId(userId: string): Promise<SubscriptionOutputDto | null>;
}

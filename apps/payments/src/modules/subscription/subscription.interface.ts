import { SubscriptionOutputDto } from "@libs/contracts/index";
import { SubscriptionCreateDto } from "./dto/subscription-create.dto";

export abstract class ISubscriptionCommandRepository {
	abstract createSubscription(subscription: SubscriptionCreateDto): Promise<number>;
	abstract updateSubscription(id: number, data: any): Promise<boolean>;
	abstract getSubscriptionByUserId(userId: string): Promise<any>;
	abstract deleteSubscription(subscriptionId: number): Promise<boolean>;
	abstract deleteDeletedSubscriptions(): Promise<void>;
}

export abstract class ISubscriptionQueryRepository {
	abstract getSubscriptionByUserId(userId: string): Promise<SubscriptionOutputDto | null>;
}

import { SubscriptionOutputDto } from "@libs/contracts/index";
import { SubscriptionCreateDto } from "./dto/subscription-create.dto";

export abstract class ISubscriptionCommandRepository {
	abstract createSubscription(subscription: SubscriptionCreateDto): Promise<string>;
	abstract updateSubscription(id: string, data: any): Promise<boolean>;
	abstract getSubscriptionByUserId(userId: string): Promise<any>;
	abstract deleteSubscription(subscriptionId: string): Promise<boolean>;
}

export abstract class ISubscriptionQueryRepository {
	abstract getSubscriptionByUserId(userId: string): Promise<SubscriptionOutputDto | null>;
}

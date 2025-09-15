import { Injectable } from "@nestjs/common";
import { ISubscriptionQueryRepository } from "./subscription.interface";

// Idempotency-Key
export class SubscInputDto {
	planCode: string;
	provider: string;
	userId: string;
	idempotencyKey: string;
}

@Injectable()
export class SubscriptionService {
	constructor(private readonly subscriptionCommandRepo: ISubscriptionQueryRepository) {}

	async createSubscription(dto: SubscInputDto): Promise<any> {
		const result = await this.subscriptionCommandRepo.getUniqueSubscription(dto.planCode);
		console.log("We received --->", dto);
		console.log("Result --->", result);
		return result;
	}
}

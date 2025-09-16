import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PaymentsMessages } from "@libs/constants/payment-messages";
import { ISubscriptionQueryRepository } from "./subscription.interface";
import { SubscriptionOutputDto } from "@libs/contracts/index";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";
import { SubscriptionService } from "./subscription.service";

@Controller()
export class SubscriptionController {
	constructor(
		private readonly subscriptionQueryRepository: ISubscriptionQueryRepository,
		private readonly subscriptionService: SubscriptionService,
	) {}

	@MessagePattern({ cmd: PaymentsMessages.GET_SUBSCRIPTION })
	async getSubscription(@Payload() payload: { userId: string }): Promise<SubscriptionOutputDto> {
		console.log("SUBSCRIPTION CONTROLLER");

		const subscription = await this.subscriptionQueryRepository.getSubscriptionByUserId(payload.userId);
		if (!subscription) {
			throw new NotFoundRpcException("Subscription not found");
		}
		return subscription;
	}

	@MessagePattern({ cmd: PaymentsMessages.AUTO_RENEWAL_SUBSCRIPTION })
	async autoRenewalSubscription(@Payload() payload: { userId: string; isAutoRenewal: boolean }): Promise<boolean> {
		await this.subscriptionService.autoRenewalSubscription(payload.userId, payload.isAutoRenewal);
		return true;
	}
}

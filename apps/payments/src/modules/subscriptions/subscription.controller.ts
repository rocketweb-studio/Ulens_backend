import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PaymentsMessages } from "@libs/constants/index";
import { SubscriptionService } from "./subscription.service";

// Idempotency-Key
export class SubscInputDto {
	planCode: string;
	provider: "MOCK" | "STRIPE" | "PAYPAL";
	userId: string;
	idempotencyKey: string;
}

@Controller()
export class SubscriptionController {
	constructor(private readonly subscriptionService: SubscriptionService) {}

	@MessagePattern({ cmd: PaymentsMessages.CREATE_SUBSCRIPTION })
	async createSubscription(@Payload() dto: SubscInputDto): Promise<any> {
		return this.subscriptionService.createSubscription(dto);
	}
}

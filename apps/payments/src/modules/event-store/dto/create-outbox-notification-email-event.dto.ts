import { PaymentProvidersEnum } from "@libs/contracts/index";
import { RabbitEvents } from "@libs/rabbit/rabbit.constants";
export class CreateOutboxNotificationEmailEventDto {
	sessionId: string;
	userId: string;
	planId: number;
	isSuccessPayment: boolean;
	provider: PaymentProvidersEnum;
	eventType: RabbitEvents;
	userEmail: string;
	premiumExpDate: string;
	message?: string;
}

export class OutBoxNotificationEventDto extends CreateOutboxNotificationEmailEventDto {
	plan_name: string;
	plan_interval: string;
	plan_price: number;
	plan_description: string;
}

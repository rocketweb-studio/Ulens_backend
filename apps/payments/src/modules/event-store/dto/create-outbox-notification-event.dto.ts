import { PaymentProvidersEnum } from "@libs/contracts/index";

export class CreateOutBoxNotificationEventDto {
	sessionId: string;
	userId: string;
	planId: number;
	isSuccessPayment: boolean;
	provider: PaymentProvidersEnum;
	eventType: "payment.succeeded" | "payment.failed" | "notification.send";
	userEmail: string;
	premiumExpDate: string;
}

export class OutBoxNotificationEventDto extends CreateOutBoxNotificationEventDto {
	plan_name: string;
	plan_interval: string;
	plan_price: number;
	plan_description: string;
}

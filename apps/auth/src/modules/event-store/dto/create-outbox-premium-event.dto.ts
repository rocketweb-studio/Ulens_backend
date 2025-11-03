import { RabbitEvents } from "@libs/rabbit/rabbit.constants";

export class CreateOutBoxPremiumActivatedEventDto {
	sessionId: string;
	userId: string;
	planId: number;
	premiumExpDate: string;
	userEmail: string;
	eventType: RabbitEvents;
}

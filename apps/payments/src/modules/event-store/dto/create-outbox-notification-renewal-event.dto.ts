import { RabbitEvents } from "@libs/rabbit/rabbit.constants";

export class CreateOutboxNotificationRenewalCheckedEventDto {
	userId: string;
	eventType: RabbitEvents;
	message: string;
}

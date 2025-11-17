import { RabbitEvents } from "@libs/rabbit/rabbit.constants";

export class CreateOutboxToGatewayDto {
	userId: string;
	eventType: RabbitEvents;
	message: string;
	scheduledAt: string | Date | null;
	notificationId: number;
	sentAt: Date;
	readAt: Date | null;
}

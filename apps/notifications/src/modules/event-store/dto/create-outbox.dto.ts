import { RabbitEvents } from "@libs/rabbit/rabbit.constants";

export class CreateOutboxToGatewayDto {
	userId: string;
	eventType: RabbitEvents;
	message: string;
	scheduledAt: string | Date | null;
	notificationId: number;
	sentAt: Date;
	readAt: Date | null;
	metadata: any | null;
}

export class CreateOutboxToPaymentsDto {
	userId: string;
	eventType: RabbitEvents;
	scheduledAt: string | Date | null;
}

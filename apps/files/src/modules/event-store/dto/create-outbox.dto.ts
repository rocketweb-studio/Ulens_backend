import { RabbitEvents } from "@libs/rabbit/rabbit.constants";

export class CreateOutboxPostEventDto {
	userId: string;
	eventType: RabbitEvents;
	message: string;
	scheduledAt: string | Date | null;
	notificationId: number;
	sentAt: Date;
	readAt: Date | null;
}

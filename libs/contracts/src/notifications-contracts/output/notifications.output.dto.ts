import { ApiProperty } from "@nestjs/swagger";

export class NotificationDto {
	@ApiProperty({ description: "Notification id", example: 1 })
	id: number;
	@ApiProperty({ description: "Notification message", example: "Notification message" })
	message: string;
	@ApiProperty({ description: "Notification created at", example: "2021-01-01T00:00:00.000Z" })
	sentAt: Date;
	@ApiProperty({ description: "Notification read at", example: "2021-01-01T00:00:00.000Z" })
	readAt: Date | null;
}

export class NotificationsOutputDto {
	@ApiProperty({ description: "Notifications", type: [NotificationDto] })
	notifications: NotificationDto[];
	@ApiProperty({ description: "Unreaded count", example: 1 })
	unreadedCount: number;
}

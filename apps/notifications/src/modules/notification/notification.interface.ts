import { NotificationDto, NotificationsOutputDto } from "@libs/contracts/notifications-contracts/output/notifications.output.dto";
import { CreateNotificationInputDto } from "@notifications/modules/notification/dto/create-notification.input.dto";

export abstract class INotificationCommandRepository {
	abstract createNotification(dto: CreateNotificationInputDto): Promise<any>;
	abstract readNotification(userId: string, notificationId: string): Promise<boolean>;
	abstract markNotificationAsSent(notificationId: number, sentAt: Date): Promise<void>;
	abstract deleteDeletedNotifications(): Promise<void>;
}

export abstract class INotificationQueryRepository {
	abstract getNotifications(userId: string): Promise<NotificationsOutputDto>;
	abstract getNotificationById(notificationId: string): Promise<NotificationDto | null>;
}

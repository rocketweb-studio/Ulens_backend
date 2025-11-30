import { Cron, CronExpression } from "@nestjs/schedule";
import { CreateNotificationInputDto } from "@notifications/modules/notification/dto/create-notification.input.dto";
import { INotificationCommandRepository } from "@notifications/modules/notification/notification.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationService {
	constructor(private readonly notificationCommandRepository: INotificationCommandRepository) {}

	async createNotification(dto: CreateNotificationInputDto): Promise<any> {
		return this.notificationCommandRepository.createNotification(dto);
	}

	async markNotificationAsSent(notificationId: number, sentAt: Date): Promise<void> {
		await this.notificationCommandRepository.markNotificationAsSent(notificationId, sentAt);
	}

	async readNotification(userId: string, notificationId: string): Promise<boolean> {
		const result = await this.notificationCommandRepository.readNotification(userId, notificationId);
		return result;
	}
	async readNotifications(userId: string, notificationIds: number[]): Promise<boolean> {
		const result = await this.notificationCommandRepository.readNotifications(userId, notificationIds);
		return result;
	}

	async softDeleteUserNotifications(userId: string): Promise<void> {
		await this.notificationCommandRepository.softDeleteUserNotifications(userId);
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async deleteDeletedNotifications() {
		await this.notificationCommandRepository.deleteDeletedNotifications();
	}
}

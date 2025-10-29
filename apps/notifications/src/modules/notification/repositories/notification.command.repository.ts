import { PrismaService } from "@notifications/core/prisma/prisma.service";
import { INotificationCommandRepository } from "@notifications/modules/notification/notification.interface";
import { Injectable } from "@nestjs/common";
import { CreateNotificationInputDto } from "@notifications/modules/notification/dto/create-notification.input.dto";

@Injectable()
export class NotificationCommandRepository implements INotificationCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createNotification(dto: CreateNotificationInputDto): Promise<any> {
		const createdNotification = await this.prisma.notification.create({
			data: dto,
		});
		return createdNotification;
	}

	async readNotification(userId: string, notificationId: string): Promise<boolean> {
		const updatedNotification = await this.prisma.notification.update({
			where: { id: +notificationId, userId },
			data: { readAt: new Date() },
		});
		return !!updatedNotification;
	}

	async markNotificationAsSent(notificationId: number, sentAt: Date): Promise<void> {
		await this.prisma.notification.update({
			where: { id: notificationId },
			data: { sentAt: sentAt },
		});
	}

	async softDeleteUserNotifications(userId: string): Promise<void> {
		await this.prisma.notification.updateMany({
			where: { userId },
			data: { deletedAt: new Date() },
		});
	}

	async deleteDeletedNotifications(): Promise<void> {
		const { count } = await this.prisma.notification.deleteMany({
			where: { deletedAt: { not: null } },
		});
		console.log(`Deleted deleted notifications: [${count}]`);
	}
}

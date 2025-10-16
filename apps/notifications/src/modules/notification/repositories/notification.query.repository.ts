import { INotificationQueryRepository } from "../notification.interface";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@notifications/core/prisma/prisma.service";
import { NotificationDto, NotificationsOutputDto } from "@libs/contracts/notifications-contracts/output/notifications.output.dto";
import { Notification } from "@notifications/core/prisma/generated/client";
@Injectable()
export class NotificationQueryRepository implements INotificationQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getNotifications(userId: string): Promise<NotificationsOutputDto> {
		const notifications = await this.prisma.notification.findMany({
			where: {
				userId,
				createdAt: {
					gt: new Date(new Date().setDate(new Date().getDate() - 30)),
				},
				sentAt: {
					not: null,
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		const unreadedCount = await this.prisma.notification.count({
			where: { userId, readAt: null },
		});
		return {
			notifications: notifications.map((notification) => this._mapNotificationToDto(notification)),
			unreadedCount,
		};
	}

	async getNotificationById(notificationId: string): Promise<NotificationDto | null> {
		const notification = await this.prisma.notification.findUnique({
			where: { id: +notificationId },
		});
		return notification ? this._mapNotificationToDto(notification) : null;
	}

	private _mapNotificationToDto(notification: Notification): NotificationDto {
		return {
			id: notification.id,
			message: notification.message,
			sentAt: notification.sentAt as Date,
			readAt: notification.readAt as Date,
		};
	}
}

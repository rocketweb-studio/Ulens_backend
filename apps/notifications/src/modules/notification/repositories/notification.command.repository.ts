import { PrismaService } from "@notifications/core/prisma/prisma.service";
import { INotificationCommandRepository } from "../notification.interface";
import { Injectable } from "@nestjs/common";
import { CreateNotificationInputDto } from "../dto/create-notification.input.dto";

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

	async markNotificationAsSent(notificationId: number): Promise<void> {
		await this.prisma.notification.update({
			where: { id: notificationId },
			data: { sentAt: new Date() },
		});
	}
}

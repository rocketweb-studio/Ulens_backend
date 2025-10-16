import { CreateNotificationInputDto } from "./dto/create-notification.input.dto";
import { INotificationCommandRepository } from "./notification.interface";
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
}

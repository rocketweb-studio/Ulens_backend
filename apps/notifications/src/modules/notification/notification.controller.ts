import { NotificationMessages } from "@libs/constants/notification-messages";
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { INotificationQueryRepository } from "@notifications/modules/notification/notification.interface";
import { NotificationsOutputDto } from "@libs/contracts/notifications-contracts/output/notifications.output.dto";
import { NotificationService } from "@notifications/modules/notification/notification.service";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";

@Controller()
export class NotificationController {
	constructor(
		private readonly notificationQueryRepository: INotificationQueryRepository,
		private readonly notificationService: NotificationService,
	) {}

	@MessagePattern({ cmd: NotificationMessages.GET_NOTIFICATIONS })
	async getNotifications(@Payload() dto: { userId: string }): Promise<NotificationsOutputDto> {
		return this.notificationQueryRepository.getNotifications(dto.userId);
	}

	@MessagePattern({ cmd: NotificationMessages.READ_NOTIFICATION })
	async readNotification(@Payload() dto: { userId: string; notificationId: string }): Promise<boolean> {
		const notification = await this.notificationQueryRepository.getNotificationById(dto.notificationId);
		if (!notification) {
			throw new NotFoundRpcException("Notification not found");
		}
		if (notification.readAt) {
			return true;
		}
		const result = await this.notificationService.readNotification(dto.userId, dto.notificationId);
		return result;
	}
}

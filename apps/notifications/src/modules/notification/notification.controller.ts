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

	@MessagePattern({ cmd: NotificationMessages.READ_NOTIFICATIONS })
	async readNotifications(@Payload() dto: { userId: string; notificationIds: number[] }): Promise<boolean> {
		const invalidNotificationIds = await this.notificationQueryRepository.getInvalidNotificationsByIds(dto.notificationIds);
		if (invalidNotificationIds.length > 0) {
			throw new NotFoundRpcException(`Invalid notification ids - ${invalidNotificationIds.join(", ")}`);
		}
		const result = await this.notificationService.readNotifications(dto.userId, dto.notificationIds);
		return result;
	}
}

import { Body, Controller, Get, HttpCode, HttpStatus, Put, UseGuards } from "@nestjs/common";
import { NotificationsClientService } from "./notifications-client.service";
import { JwtAccessAuthGuard } from "@gateway/core/guards/jwt-access-auth.guard";
import { ExtractUserFromRequest } from "@gateway/core/decorators/param/extract-user-from-request";
import { PayloadFromRequestDto } from "@libs/contracts/auth-contracts/input/payload-from-request.dto";
import { NotificationsOutputDto } from "@libs/contracts/notifications-contracts/output/notifications.output.dto";
import { GetNotificationsSwagger } from "@gateway/core/decorators/swagger/notifications/get-notifications.decorator";
import { ReadNotificationSwagger } from "@gateway/core/decorators/swagger/notifications/read-notification.decorator";
import { ReadNotificationInputDto } from "@libs/contracts/notifications-contracts/input/read-notification.input.dto";
import { ApiTags } from "@nestjs/swagger";
import { ApiTagsNames } from "@libs/constants/index";

@ApiTags(ApiTagsNames.NOTIFICATIONS)
@Controller("notifications")
@UseGuards(JwtAccessAuthGuard)
export class NotificationsClientController {
	constructor(private readonly notificationsClientService: NotificationsClientService) {}

	@GetNotificationsSwagger()
	@Get()
	@HttpCode(HttpStatus.OK)
	async getNotifications(@ExtractUserFromRequest() user: PayloadFromRequestDto): Promise<NotificationsOutputDto> {
		const notifications = await this.notificationsClientService.getNotifications(user.userId);
		return notifications;
	}

	@ReadNotificationSwagger()
	@Put("read")
	@HttpCode(HttpStatus.NO_CONTENT)
	async readNotification(@ExtractUserFromRequest() user: PayloadFromRequestDto, @Body() dto: ReadNotificationInputDto): Promise<void> {
		await this.notificationsClientService.readNotification(user.userId, dto.notificationId);
		return;
	}
}

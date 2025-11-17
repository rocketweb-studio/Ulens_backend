import { Controller, UseGuards } from "@nestjs/common";
import { MessengerClientService } from "./messenger-client.service";
import { JwtAccessAuthGuard } from "@gateway/core/guards/jwt-access-auth.guard";

// @ApiTags(ApiTagsNames.MESSENGER)
@Controller("messenger")
@UseGuards(JwtAccessAuthGuard)
export class MessengerClientController {
	constructor(private readonly messengerClientService: MessengerClientService) {}

	// @GetNotificationsSwagger()
	// @Get()
	// @HttpCode(HttpStatus.OK)
	// async getNotifications(@ExtractUserFromRequest() user: PayloadFromRequestDto): Promise<NotificationsOutputDto> {
	// 	const notifications = await this.notificationsClientService.getNotifications(user.userId);
	// 	return notifications;
	// }
}

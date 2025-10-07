import { Controller } from "@nestjs/common";
import { NotificationService } from "@notifications/modules/notification/notification.service";

@Controller()
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}
}

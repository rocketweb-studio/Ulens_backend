import { Module } from "@nestjs/common";
import { NotificationService } from "@notifications/modules/notification/notification.service";
import { INotificationCommandRepository } from "@notifications/modules/notification/notification.interface";
import { NotificationCommandRepository } from "@notifications/modules/notification/repositories/notification.command.repository";

@Module({
	providers: [NotificationService, { provide: INotificationCommandRepository, useClass: NotificationCommandRepository }],
	exports: [NotificationService],
})
export class NotificationModule {}

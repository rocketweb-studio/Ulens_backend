import { Module } from "@nestjs/common";
import { NotificationService } from "@notifications/modules/notification/notification.service";
import { INotificationCommandRepository } from "@notifications/modules/notification/notification.interface";
import { NotificationCommandRepository } from "@notifications/modules/notification/infrastructure/notification.command.repository";
import { INotificationQueryRepository } from "@notifications/modules/notification/notification.interface";
import { NotificationQueryRepository } from "@notifications/modules/notification/infrastructure/notification.query.repository";
import { NotificationController } from "@notifications/modules/notification/notification.controller";

@Module({
	controllers: [NotificationController],
	providers: [
		NotificationService,
		{ provide: INotificationCommandRepository, useClass: NotificationCommandRepository },
		{ provide: INotificationQueryRepository, useClass: NotificationQueryRepository },
	],
	exports: [NotificationService],
})
export class NotificationModule {}

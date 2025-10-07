import { INotificationCommandRepository } from "./notification.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationService {
	constructor(private readonly notificationCommandRepository: INotificationCommandRepository) {}
}

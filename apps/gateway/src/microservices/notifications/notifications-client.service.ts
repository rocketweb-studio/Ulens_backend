import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Microservice } from "@libs/constants/microservices";
import { NotificationMessages } from "@libs/constants/notification-messages";
import { NotificationsOutputDto } from "@libs/contracts/notifications-contracts/output/notifications.output.dto";
import { firstValueFrom } from "rxjs";

//вынести класс в библиотеку
class SendEmailDto {
	email: string;
	code: string;
}

@Injectable()
export class NotificationsClientService {
	constructor(@Inject(Microservice.NOTIFICATIONS) private readonly client: ClientProxy) {}

	async sendRegistrationEmail(sendEmailDto: SendEmailDto): Promise<void> {
		this.client.emit(NotificationMessages.SEND_REGISTRATION_EMAIL, sendEmailDto);
	}

	async sendPasswordRecoveryEmail(sendEmailDto: SendEmailDto): Promise<void> {
		this.client.emit(NotificationMessages.SEND_PASSWORD_RECOVERY_EMAIL, sendEmailDto);
	}

	async getNotifications(userId: string): Promise<NotificationsOutputDto> {
		const notifications = await firstValueFrom(this.client.send({ cmd: NotificationMessages.GET_NOTIFICATIONS }, { userId }));
		return notifications;
	}

	async readNotification(userId: string, notificationId: number): Promise<void> {
		await firstValueFrom(this.client.send({ cmd: NotificationMessages.READ_NOTIFICATION }, { userId, notificationId }));
		return;
	}
}

import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import {
	EmailService,
	MailPurpose,
} from "@notifications/modules/mail/mail.service";
import { NotificationMessages } from "@libs/constants/notification-messages";

//вынести класс в библиотеку
class SendEmailDto {
	email: string;
	code: string;
}

@Controller()
export class MailController {
	constructor(private readonly emailService: EmailService) {}

	/**
	 * Заменили MessagePattern на EventPattern потому что в предыдущей реализации письмо отправлялось но пользователю
	 *    возвращалась 500 ошибка
	 */
	@EventPattern(NotificationMessages.SEND_REGISTRATION_EMAIL)
	async sendRegistrationEmail(
		@Payload() sendEmailDto: SendEmailDto,
	): Promise<void> {
		await this.emailService.sendEmail(
			sendEmailDto.email,
			sendEmailDto.code,
			MailPurpose.REGISTRATION,
		);
	}

	@EventPattern(NotificationMessages.SEND_PASSWORD_RECOVERY_EMAIL)
	async sendPasswordRecoveryEmail(
		@Payload() sendEmailDto: SendEmailDto,
	): Promise<void> {
		await this.emailService.sendEmail(
			sendEmailDto.email,
			sendEmailDto.code,
			MailPurpose.PASSWORD_RECOVERY,
		);
	}
}

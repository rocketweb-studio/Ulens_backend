import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { MailConfig } from "@notifications/modules/mail/mail.config";
import { buildRegistrationTemplate } from "@notifications/modules/mail/templates/registration.template";
import { buildPasswordRecoveryTemplate } from "@notifications/modules/mail/templates/recovery.template";
import { buildPaymentTemplate } from "@notifications/modules/mail/templates/payment.template";
import { LetterDetailsDto } from "@notifications/modules/mail/dto/letter-details.dto";
import { MailPurpose } from "@libs/constants/notification.constants";
@Injectable()
export class EmailService {
	constructor(
		private mailerService: MailerService,
		private mailConfig: MailConfig,
	) {}

	async sendEmail(email: string, dto: LetterDetailsDto, purpose: MailPurpose): Promise<void> {
		console.log("[NOTIFICATIONS][MAIL] sending email to", email, "with purpose", purpose);
		const template = {
			html: "",
			subject: "",
		};
		switch (purpose) {
			case MailPurpose.REGISTRATION:
				template.html = buildRegistrationTemplate(dto.code, this.mailConfig.frontendUrl);
				template.subject = "Registration Confirmation!";
				break;
			case MailPurpose.PASSWORD_RECOVERY:
				template.html = buildPasswordRecoveryTemplate(dto.code, email, this.mailConfig.frontendUrl);
				template.subject = "Password Recovery!";
				break;
			case MailPurpose.PAYMENT_SUCCEEDED:
				template.html = buildPaymentTemplate(dto, this.mailConfig.frontendUrl, true);
				template.subject = "Payment Succeeded!";
				break;
			case MailPurpose.PAYMENT_FAILED:
				template.html = buildPaymentTemplate(dto, this.mailConfig.frontendUrl, false);
				template.subject = "Payment Failed!";
				break;
		}

		await this.mailerService.sendMail({
			to: email,
			subject: template.subject,
			html: template.html,
		});
	}
}

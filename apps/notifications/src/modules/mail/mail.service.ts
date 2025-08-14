import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailConfig } from './mail.config';
import { buildRegistrationTemplate } from './templates/registration.template';
import { buildPasswordRecoveryTemplate } from './templates/recovery.template';

export enum MailPurpose {
  REGISTRATION = 'REGISTRATION',
  PASSWORD_RECOVERY = 'PASSWORD_RECOVERY'
}

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private mailConfig: MailConfig
  ) {}

  async sendEmail(email: string, code: string, purpose: MailPurpose): Promise<void> {
    const template = {
      html: '',
      subject: ''
    };
    switch (purpose) {
      case MailPurpose.REGISTRATION:
        template.html = buildRegistrationTemplate(code, this.mailConfig.frontendUrl);
        template.subject = 'Registration Confirmation!';
        break;
      case MailPurpose.PASSWORD_RECOVERY:
        template.html = buildPasswordRecoveryTemplate(code, this.mailConfig.frontendUrl);
        template.subject = 'Password Recovery!';
        break;
    }

    await this.mailerService.sendMail({
      to: email,
      subject: template.subject,
      html: template.html
    });
  }
}

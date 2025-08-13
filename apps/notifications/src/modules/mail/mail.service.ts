import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailConfig } from './mail.config';
import { buildActivationTemplate } from './templates/activation.template';
import { buildPasswordRecoveryTemplate } from './templates/recovery.template';

export enum MailPurpose {
  ACTIVATION = 'activationAccount',
  PASSWORD_RECOVERY = 'passwordRecovery'
}

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private mailConfig: MailConfig
  ) {}

  async sendEmail(email: string, code: string, purpose: MailPurpose): Promise<void> {
    console.log('sendEmail', email, code, purpose);
    const template = {
      html: '',
      subject: ''
    };
    switch (purpose) {
      case MailPurpose.ACTIVATION:
        template.html = buildActivationTemplate(code, this.mailConfig.frontendUrl);
        template.subject = 'Account activation!';
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

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailService, MailPurpose } from './mail.service';
import { NotificationMessages } from '@libs/constants/notification-messages';

//вынести класс в библиотеку
class SendEmailDto {
  email: string;
  code: string;
}

@Controller()
export class MailController {
  constructor(private readonly emailService: EmailService) {}

  @MessagePattern({ cmd: NotificationMessages.SEND_ACTIVATION_EMAIL })
  async sendActivationEmail(@Payload() sendEmailDto: SendEmailDto): Promise<void> {
    await this.emailService.sendEmail(sendEmailDto.email, sendEmailDto.code, MailPurpose.ACTIVATION);
  }

  @MessagePattern({ cmd: NotificationMessages.SEND_PASSWORD_RECOVERY_EMAIL })
  async sendPasswordRecoveryEmail(@Payload() sendEmailDto: SendEmailDto): Promise<void> {
    await this.emailService.sendEmail(sendEmailDto.email, sendEmailDto.code, MailPurpose.PASSWORD_RECOVERY);
  }
}

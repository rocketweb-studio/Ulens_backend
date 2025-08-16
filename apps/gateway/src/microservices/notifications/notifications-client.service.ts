import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Microservice } from '@libs/constants/microservices';
import { NotificationMessages } from '@libs/constants/notification-messages';

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
}

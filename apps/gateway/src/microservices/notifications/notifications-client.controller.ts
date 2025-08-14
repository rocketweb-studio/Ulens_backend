// todo Контроллер для тестирования отправки email, в коде не использовать, удалить после тестирования

import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsClientService } from './notifications-client.service';

@Controller('email')
export class NotificationsClientController {
  constructor(private readonly notificationsClientService: NotificationsClientService) {}
  @Post()
  async sendPasswordRecoveryEmail(@Body() sendEmailDto: any): Promise<void> {
    return this.notificationsClientService.sendRegistrationEmail(sendEmailDto);
  }
}

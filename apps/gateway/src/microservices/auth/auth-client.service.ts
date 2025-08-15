import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IAuthClientService, CreateUserDto, BaseUserView, ConfirmCodeDto, ResendEmailDto } from '@libs/contracts/index';
import { Microservice } from '@libs/constants/microservices';
import { AuthMessages } from '@libs/constants/auth-messages';
import { UnexpectedErrorRpcException } from '@libs/exeption/rpc-exeption';
import { NotificationsClientService } from '../notifications/notifications-client.service';

@Injectable()
export class AuthClientService implements IAuthClientService {
  constructor(@Inject(Microservice.AUTH) private readonly client: ClientProxy,
              private readonly notificationsClientService: NotificationsClientService) {}

  async getUsers(): Promise<BaseUserView[]> {
    return firstValueFrom(this.client.send({ cmd: AuthMessages.GET_USERS }, {}));
  }

  async createUser(createUserDto: CreateUserDto): Promise<BaseUserView> {
    try {
      const response = await firstValueFrom(this.client.send({ cmd: AuthMessages.CREATE_USER }, createUserDto));
      return response;
    } catch (e) {
      // можно использовать InternalServerErrorException и тогда будет использоваться фильтр для http ошибок
      throw new UnexpectedErrorRpcException(e.message);
    }
  }

  async registration(createUserDto: CreateUserDto): Promise<BaseUserView> {
    const { user, confirmationCode } = await firstValueFrom(this.client.send({ cmd: AuthMessages.REGISTRATION }, createUserDto));
    
    if(user?.email && confirmationCode){
      this.notificationsClientService.sendRegistrationEmail({
      email:user.email,
      code: confirmationCode
    });
    }else{
      console.log('Registration succeeded but email data is missing')
    }
    
    return user;
  }

  async emailConfirmation(confirmCodeDto: ConfirmCodeDto): Promise<Boolean>{
    return firstValueFrom(this.client.send({ cmd: AuthMessages.EMAIL_CONFIRMATION }, confirmCodeDto));
  }

  async resendEmail(resendEmailDto: ResendEmailDto): Promise<Boolean> {
    const { code } = await firstValueFrom(this.client.send({ cmd: AuthMessages.RESEND_EMAIL  }, resendEmailDto));

    if(code){
      this.notificationsClientService.sendRegistrationEmail({
      email: resendEmailDto.email,
      code: code
    });
    }else{
      console.log('Email confirmation code was updated but email data is missing')
    }

    return true;
  } 
}

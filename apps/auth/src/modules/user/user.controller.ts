import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from '@auth/modules/user/user.service';
import { AuthMessages } from '@libs/constants/auth-messages';
import { ConfirmCodeDto, CreateUserDto, NewPasswordDto, ResendEmailDto } from '@libs/contracts/index';
import { JwtRefreshAuthGuard } from '@auth/core/guards/jwt-refresh-auth.guard';
import { CredentialsAuthGuard } from '@auth/core/guards/credentials-auth.guard';
import { UserWithPayloadFromJwt, UserWithRefreshToken } from '@auth/modules/user/dto/user.dto';
import { LoginInputDto } from './dto/login-input.dto';
import { LoginOutputDto } from './dto/login-output.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: AuthMessages.GET_USERS })
  async getUsers() {
    return this.userService.getUsers();
  }

  @MessagePattern({ cmd: AuthMessages.CREATE_USER })
  async createUser(@Payload() createUserDto: CreateUserDto) {
    return this.userService.createUserExample(createUserDto);
  }

  @MessagePattern({ cmd: AuthMessages.REGISTRATION })
  async registration(@Payload() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @MessagePattern({ cmd: AuthMessages.EMAIL_CONFIRMATION })
  async emailConfirmation(@Payload() confirmCodeDto: ConfirmCodeDto) {
    return this.userService.confirmEmail(confirmCodeDto);
  }

  @MessagePattern({ cmd: AuthMessages.RESEND_EMAIL })
  async registrationEmailResending(@Payload() resendEmailDto: ResendEmailDto) {
    return this.userService.resendEmail(resendEmailDto);
  }

  @MessagePattern({ cmd: AuthMessages.PASSWORD_RECOVERY })
  async passwordRecovery(@Payload() passwordRecoveryDto: ResendEmailDto) {
    return this.userService.passwordRecovery(passwordRecoveryDto);
  }

  @MessagePattern({ cmd: AuthMessages.NEW_PASSWORD })
  async newPassword(@Payload() newPasswordDto: NewPasswordDto) {
    return this.userService.setNewPassword(newPasswordDto);
  }

  @UseGuards(CredentialsAuthGuard)
  @MessagePattern({ cmd: AuthMessages.LOGIN })
  async login(@Payload() dto: LoginInputDto): Promise<LoginOutputDto> {
    const response = await this.userService.login(dto);
    return response;
  }

  @UseGuards(JwtRefreshAuthGuard)
  @MessagePattern({ cmd: AuthMessages.REFRESH_TOKENS })
  async refreshTokens(@Payload() dto: UserWithPayloadFromJwt): Promise<{ refreshToken: string; payloadForJwt: any }> {
    const response = await this.userService.refreshTokens(dto);
    return response;
  }

  @UseGuards(JwtRefreshAuthGuard)
  @MessagePattern({ cmd: AuthMessages.LOGOUT })
  async logout(@Payload() dto: UserWithPayloadFromJwt): Promise<any> {
    const response = await this.userService.logout(dto);
    return response;
  }
}

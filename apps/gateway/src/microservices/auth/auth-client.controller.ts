import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common';
import { AuthClientService } from '@/microservices/auth/auth-client.service';
import { CreateUserDto, UsersModel, BaseUserView, ConfirmCodeDto, ResendEmailDto } from '@libs/contracts/index';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpStatuses, RouterPaths } from '@libs/constants/index';
import { IncorrectInputDataResponse } from '../../common/swagger-examples/incorrect-input-data-response';

@ApiTags(RouterPaths.AUTH)
// @Controller(RouterPaths.AUTH) must be here when we delete getUsers and createUser methods
@Controller()
export class AuthClientController {
  constructor(private readonly authClientService: AuthClientService) {}

  @Get(RouterPaths.USERS)
  @ApiOperation({ summary: "Get a list of users" })
  // @ApiResponse({ status:200, description: "Success" }) /*пример без Example Value | Schema*/
  // @ApiOkResponse({ description: "Success" })  /*то же самое но более короткая форма*/
  @ApiOkResponse({ type: UsersModel })
  async getUsers(): Promise<BaseUserView[]> {
    const response = await this.authClientService.getUsers();
    return response;
  }

  @Post(RouterPaths.USERS)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<BaseUserView> {
    return this.authClientService.createUser(createUserDto);
  }

  @Post(RouterPaths.REGISTRATION)
  @HttpCode(HttpStatuses.NO_CONTENT_204)
  @ApiOperation({ summary: "Registrate a new user. Email with confirmation code will be send to passed email address." })
  @ApiResponse({ status: 204, 
    description: `An email with a verification code has been sent to the specified email address` })
  @ApiResponse(IncorrectInputDataResponse)
  async registration(@Body() createUserDto: CreateUserDto): Promise<BaseUserView> {
    return this.authClientService.registration(createUserDto);
  }

  @Post(RouterPaths.REGISTRATION_CONFIRMATION)
  @HttpCode(HttpStatuses.NO_CONTENT_204)
  @ApiOperation({ summary: "Confirm registration" })
  @ApiResponse({ status: 204, description: "Email was verified. Account was activated" })
  @ApiResponse(IncorrectInputDataResponse)
  async registrationConfirmation(@Body() confirmCodeDto: ConfirmCodeDto): Promise<Boolean> {
     return this.authClientService.emailConfirmation(confirmCodeDto);
  }

  @Post(RouterPaths.REGISTRATION_EMAIL_RESENDING)
  @HttpCode(HttpStatuses.NO_CONTENT_204)
  @ApiOperation({ summary: "Resend confirmation registration Email if user exists"})
  @ApiResponse({ status: 204, description: "An email with a verification code has been sent to the specified email address" })
  @ApiResponse(IncorrectInputDataResponse)
  async registrationEmailResending(@Body() resendEmailDto: ResendEmailDto): Promise<Boolean> {
    return this.authClientService.resendEmail(resendEmailDto);
  }

  @Post(RouterPaths.PASSWORD_RECOVERY)
  @HttpCode(HttpStatuses.NO_CONTENT_204)
  @ApiOperation({ summary: "Password recovery via Email confirmation. Email should be sent with RecoveryCode inside" })
  @ApiResponse({ status: 204, description: "An email with a recovery code has been sent to the specified email address" })
  @ApiResponse(IncorrectInputDataResponse)
  async passwordRecovery(@Body() passwordRecoveryDto: ResendEmailDto): Promise<Boolean>{
    return this.authClientService.passwordRecovery(passwordRecoveryDto);
  }

}
import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthClientService } from '@/microservices/auth/auth-client.service';
import { CreateUserDto, UsersModel, BaseUserViewDto } from '@libs/contracts/index';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RouterPaths } from '@libs/constants/index';
import { RpcException } from '@nestjs/microservices';
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
  async getUsers(): Promise<BaseUserViewDto[]> {
    const response = await this.authClientService.getUsers();
    return response;
  }

  @Post(RouterPaths.USERS)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<BaseUserViewDto> {
    return this.authClientService.createUser(createUserDto);
  }

  @Post(RouterPaths.REGISTRATION)
  @ApiOperation({ summary: "Registrate a new user. Email with confirmation code will be send to passed email address." })
  @ApiResponse({ status: 204, 
    description: `An email with a verification code has been sent to the specified email address` })
  @ApiResponse(IncorrectInputDataResponse)
  async registration(@Body() createUserDto: CreateUserDto): Promise<BaseUserViewDto> {
    return this.authClientService.registration(createUserDto);
  }
}
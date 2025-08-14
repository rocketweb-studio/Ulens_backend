import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthClientService } from '@/microservices/auth/auth-client.service';
import { CreateUserDto, UsersModel, BaseUserViewDto } from '@libs/contracts/index';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RouterPaths } from '@libs/constants/index';
import { RpcException } from '@nestjs/microservices';

@ApiTags(RouterPaths.AUTH)
@Controller(RouterPaths.USERS)
export class AuthClientController {
  constructor(private readonly authClientService: AuthClientService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of users' })
  // @ApiResponse({ status:200, description: "Success" }) /*пример без Example Value | Schema*/
  // @ApiOkResponse({ description: "Success" })  /*то же самое но более короткая форма*/
  @ApiOkResponse({ type: UsersModel })
  async getUsers(): Promise<BaseUserViewDto[]> {
    const response = await this.authClientService.getUsers();
    return response;
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<BaseUserViewDto> {
    return this.authClientService.createUser(createUserDto);
  }
}

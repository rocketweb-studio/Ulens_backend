import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthClientService } from '@/microservices/auth/auth-client.service';
import { CreateUserDto, UsersModel, UserViewDto } from '@/microservices/auth/auth-client.interface';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('users')
export class AuthClientController {
  constructor(private readonly authClientService: AuthClientService) {}

  @Get()
  @ApiOperation({ summary: "Get a list of users" })
  // @ApiResponse({ status:200, description: "Success" }) /*пример без Example Value | Schema*/
  // @ApiOkResponse({ description: "Success" })  /*то же самое но более короткая форма*/
  @ApiOkResponse({ type: UsersModel })
  async getUsers(): Promise<UserViewDto[]> {
    return this.authClientService.getUsers();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserViewDto> {
    return this.authClientService.createUser(createUserDto);
  }
}

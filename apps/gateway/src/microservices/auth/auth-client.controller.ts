import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthClientService } from '@/microservices/auth/auth-client.service';
import { CreateUserDto, UserViewDto } from '@/microservices/auth/auth-client.interface';

@Controller('users')
export class AuthClientController {
  constructor(private readonly authClientService: AuthClientService) {}

  @Get()
  async getUsers(): Promise<UserViewDto[]> {
    return this.authClientService.getUsers();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserViewDto> {
    return this.authClientService.createUser(createUserDto);
  }
}

// for test microservices

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user-.dto';
import { AuthMessages } from '@libs/constants/auth-messages';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: AuthMessages.GET_USERS })
  async getUsers() {
    return this.userService.getUsers();
  }

  @MessagePattern({ cmd: AuthMessages.CREATE_USER })
  async createUser(@Payload() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}

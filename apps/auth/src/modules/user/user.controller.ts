// for test microservices

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { AuthMessages } from '@libs/constants/auth-messages';
import { ConfirmCodeDto, CreateUserDto } from '@libs/contracts/index';

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
}

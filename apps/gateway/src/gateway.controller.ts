import { Controller, Get, Post, Body } from '@nestjs/common';
import { GatewayService } from './gateway.service';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get()
  getHello(): string {
    return this.gatewayService.getHello();
  }

  @Get('users')
  async getUsers() {
    return this.gatewayService.getUsers();
  }

  @Post('users')
  async createUser(@Body() createUserDto: any) {
    return this.gatewayService.createUser(createUserDto);
  }
}

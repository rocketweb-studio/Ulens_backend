import { Controller, Get } from '@nestjs/common';
import { AuthService } from '@/auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern("auth-login")
  async login(@Payload() credential: {username: string, password: string}){
    return this.authService.login(credential)
  }
}

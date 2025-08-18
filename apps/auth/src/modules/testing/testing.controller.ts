import { PrismaService } from '@auth/core/prisma/prisma.service';
import { AuthMessages } from '@libs/constants/index';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class TestingController {
  constructor(private readonly prisma: PrismaService) {}

  @MessagePattern(AuthMessages.CLEAR_AUTH_DATABASE)
  async clearDatabase() {
    await this.prisma.user.deleteMany();
    return 'clear database';
  }
}

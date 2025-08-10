import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/modules/user/dto/create-user-.dto';
import { BaseUserViewDto } from '@/modules/user/dto/view-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: createUserDto
    });
    return BaseUserViewDto.mapToView(user);
  }
}

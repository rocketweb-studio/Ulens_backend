import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto, BaseUserViewDto } from '@libs/contracts/index';
import { UnexpectedErrorRpcException } from '@libs/exeption/rpc-exeption';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
        data: createUserDto
      });
      return BaseUserViewDto.mapToView(user);
    } catch (error) {
      throw new UnexpectedErrorRpcException(error.message);
    }
  }
}

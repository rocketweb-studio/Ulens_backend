import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto, BaseUserViewDto, RegistrationResultDto } from '@libs/contracts/index';
import { IUserCommandRepository } from './user.interfaces';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService,
              private readonly userCommandRepository: IUserCommandRepository
  ) {}

  // !this method was added as example and must be removed later
  async getUsers() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  // !this method was added as example and must be removed later
  async createUserExample(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      //@ts-ignore
      data: createUserDto
    });
    return BaseUserViewDto.mapToView(user);
  }

  async createUser(dto: CreateUserDto): Promise<RegistrationResultDto>{ 
    return this.userCommandRepository.createUser(dto);
  }
}

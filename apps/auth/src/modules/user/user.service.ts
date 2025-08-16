import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto, BaseUserView, ConfirmCodeDto, ResendEmailDto, RegistrationResultView, NewPasswordDto } from '@libs/contracts/index';
import { IUserCommandRepository, IUserQueryRepository } from './user.interfaces';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';



@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService,
              private readonly userCommandRepository: IUserCommandRepository,
              private readonly userQueryRepository: IUserQueryRepository,
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
    return BaseUserView.mapToView(user);
  }

  async createUser(dto: CreateUserDto): Promise<RegistrationResultView>{
    const { email, password, userName } = dto;
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const userEntity = new User(userName, email, passwordHash);
    
    return this.userCommandRepository.createUser(userEntity);
  }

  async confirmEmail(dto: ConfirmCodeDto): Promise<Boolean>{
    return this.userCommandRepository.confirmEmail(dto);
  }

  async resendEmail(dto: ResendEmailDto): Promise<ConfirmCodeDto>{
    const confirmationCode = uuidv4();

    return this.userCommandRepository.resendEmail({...dto, confirmationCode});
  }

  async passwordRecovery(dto: ResendEmailDto): Promise<ConfirmCodeDto>{
    const recoveryCode = uuidv4();

    return this.userCommandRepository.passwordRecovery({...dto, recoveryCode});
  }

  async setNewPassword(dto: NewPasswordDto): Promise<Boolean>{
    const { newPassword, recoveryCode } = dto;
            
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    return this.userCommandRepository.setNewPassword({recoveryCode, newPasswordHash});
  }
}

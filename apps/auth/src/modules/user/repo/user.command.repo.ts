import { Injectable } from '@nestjs/common';
import { IUserCommandRepository } from '../user.interfaces';
import { PrismaService } from '@auth/core/prisma/prisma.service';
import { BaseUserView, ConfirmCodeDto, RegistrationResultView, ResendEmailConfCodeDto, RecoveryPasswordDto, NewPasswordRepoDto } from '@libs/contracts/index';
import { User } from '../user.entity';
import { isPrismaKnownRequestError } from '@libs/utils/index';
import { BaseRpcException, NotFoundRpcException, UnexpectedErrorRpcException } from '@libs/exeption/index';
import { add } from 'date-fns';
import { UserWithPassword } from '@auth/modules/user/dto/user.dto';

@Injectable()
export class PrismaUserCommandRepository implements IUserCommandRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(userDto: User): Promise<RegistrationResultView> {
    try {
      const user = await this.prisma.user.create({
        //@ts-ignore
        data: userDto
      });
      return {
        user: BaseUserView.mapToView(user),
        confirmationCode: userDto.confirmationCode!
      };
    } catch (error) {
      if (isPrismaKnownRequestError(error) && error.code === 'P2002') {
        console.log(`Error of uniqueness Email or userName: ${error}`);
        throw new BaseRpcException(400, 'User with such email or userName already exists');
      }
      console.log(`During the registration occured error: ${error}`);
      throw new UnexpectedErrorRpcException('During the registration occured unexpected error');
    }
  }

  async confirmEmail(dto: ConfirmCodeDto): Promise<Boolean> {
    const result = await this.prisma.user.updateMany({
      where: {
        confirmationCode: dto.code,
        confCodeConfirmed: false,
        confCodeExpDate: { gte: new Date() }
      },
      data: {
        confCodeConfirmed: true,
        confirmationCode: null,
        confCodeExpDate: null
      }
    });

    if (result.count === 1) return true;

    throw new BaseRpcException(400, 'Invalid or expired confirmation code');
  }

  async resendEmail(dto: ResendEmailConfCodeDto): Promise<ConfirmCodeDto> {
    const result = await this.prisma.user.updateMany({
      where: {
        email: dto.email
      },
      data: {
        confirmationCode: dto.confirmationCode,
        confCodeConfirmed: false,
        confCodeExpDate: add(new Date(), {
          hours: 1,
          minutes: 3
        }).toISOString()
      }
    });
    if (result.count === 1) return { code: dto.confirmationCode };

    throw new NotFoundRpcException('User with such email was not found');
  }

  async passwordRecovery(dto: RecoveryPasswordDto): Promise<ConfirmCodeDto> {
    const result = await this.prisma.user.updateMany({
      where: {
        email: dto.email
      },
      data: {
        recoveryCode: dto.recoveryCode,
        recCodeConfirmed: false,
        recCodeExpDate: add(new Date(), {
          hours: 1,
          minutes: 3
        }).toISOString()
      }
    });
    if (result.count === 1) return { code: dto.recoveryCode };

    throw new NotFoundRpcException('User with such email was not found');
  }

  async setNewPassword(dto: NewPasswordRepoDto): Promise<Boolean> {
    const result = await this.prisma.user.updateMany({
      where: {
        recoveryCode: dto.recoveryCode
      },
      data: {
        passwordHash: dto.newPasswordHash
      }
    });

    if (result.count === 1) return true;

    throw new BaseRpcException(400, 'Invalid or expired password recovery code');
  }

  async findUserByEmail(email: string): Promise<UserWithPassword | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });
    if (!user) return null;

    return UserWithPassword.mapToView(user);
  }
}

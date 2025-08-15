import { Injectable } from "@nestjs/common";
import { IUserCommandRepository } from "../user.interfaces";
import { PrismaService } from '@/core/prisma/prisma.service';
import { CreateUserDto, BaseUserView, ConfirmCodeDto, ResendEmailDto, RegistrationResultView, NewPasswordDto } from "@libs/contracts/index";
import { User } from "../user.entity";
import * as bcrypt from 'bcrypt';
import { isPrismaKnownRequestError } from '@libs/utils/index';
import { BaseRpcException, NotFoundRpcException, UnexpectedErrorRpcException } from "@libs/exeption/index";
import { add } from "date-fns";
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class PrismaUserCommandRepository implements IUserCommandRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createUser(dto: CreateUserDto): Promise<RegistrationResultView> {
        const { email, password, userName } = dto;

        const passwordHash = await bcrypt.hash(password, 10);

        const userEntity = new User(userName, email, passwordHash);

        try {
            const user = await this.prisma.user.create({
                //@ts-ignore
                data: userEntity
            });
            return {
                user: BaseUserView.mapToView(user),
                confirmationCode: userEntity.confirmationCode!

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
                confCodeExpDate: { gte: new Date() },
            },
            data: {
                confCodeConfirmed: true,
                confirmationCode: null,
                confCodeExpDate: null,
            },
        });

        if (result.count === 1) return true;

        throw new BaseRpcException(400, 'Invalid or expired confirmation code');
    }

    async resendEmail(dto: ResendEmailDto): Promise<ConfirmCodeDto> {
        const confirmationCode = uuidv4();
        const result = await this.prisma.user.updateMany({
            where: {
                email: dto.email,
            },
            data: {
                confirmationCode: confirmationCode,
                confCodeConfirmed: false,
                confCodeExpDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }).toISOString(),
            },
        });
        if (result.count === 1) return { code: confirmationCode };

        throw new NotFoundRpcException('User with such email was not found')
    }

    async passwordRecovery(dto: ResendEmailDto): Promise<ConfirmCodeDto> {
        const recoveryCode = uuidv4();
        const result = await this.prisma.user.updateMany({
            where: {
                email: dto.email,
            },
            data: {
                recoveryCode: recoveryCode,
                recCodeConfirmed: false,
                recCodeExpDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }).toISOString(),
            },
        });
        if (result.count === 1) return { code: recoveryCode };

        throw new NotFoundRpcException('User with such email was not found')
    }

    async setNewPassword(dto: NewPasswordDto): Promise<Boolean> {
        const { newPassword, recoveryCode } = dto;
        
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        const result = await this.prisma.user.updateMany({
            where: {
                recoveryCode: recoveryCode,
            },
            data: {
                passwordHash: newPasswordHash,
            },
        });
        
        if(result.count === 1) return true;

        throw new BaseRpcException(400, 'Invalid or expired password recovery code');
    }
}
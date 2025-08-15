import { Injectable } from "@nestjs/common";
import { IUserCommandRepository } from "../user.interfaces";
import { PrismaService } from '@/core/prisma/prisma.service';
import { CreateUserDto, BaseUserView, RegistrationResultDto, ConfirmCodeDto } from "@libs/contracts/index";
import { User } from "../user.entity";
import * as bcrypt from 'bcrypt';
import { isPrismaKnownRequestError } from '@libs/utils/index';
import { BaseRpcException, UnexpectedErrorRpcException } from "@libs/exeption/index";


@Injectable()
export class PrismaUserCommandRepository implements IUserCommandRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createUser(dto: CreateUserDto): Promise<RegistrationResultDto> {
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
}
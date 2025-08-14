import { BadRequestException, Injectable } from "@nestjs/common";
import { IUserCommandRepository } from "../user.interfaces";
import { PrismaService } from '@/core/prisma/prisma.service';
import { CreateUserDto, BaseUserViewDto } from "@libs/contracts/index";
import { User } from "../user.entity";
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BaseRpcException, UnexpectedErrorRpcException } from "@libs/exeption/index";



function isPrismaKnownRequestError(e: unknown): e is { code: string; meta?: any } {
  return !!e && typeof e === 'object' && 'code' in e!;
}

@Injectable()
export class PrismaUserCommandRepository implements IUserCommandRepository {
    constructor(private readonly prisma: PrismaService){}

    async createUser(dto: CreateUserDto): Promise<BaseUserViewDto> {
        const { email, password, userName } = dto;

        const passwordHash = await bcrypt.hash(password, 10);

        const userEntity = new User(userName, email, passwordHash);

        try {
            const user = await this.prisma.user.create({
                //@ts-ignore
                data: userEntity
            });
            return BaseUserViewDto.mapToView(user);
        } catch (error) {
            if(isPrismaKnownRequestError(error) && error.code === 'P2002'){
                console.log(`Error of uniqueness Email or userName: ${error}`);
                throw new BaseRpcException(400, 'Email or userName already exists');
            }
            console.log(`During the registration occured error: ${error}`);
            throw new BaseRpcException(400, 'During the registration occured error');;
        }
    }
}
import { Injectable } from "@nestjs/common";
import { IUserCommandRepository } from "../user.interfaces";
import { PrismaService } from "@auth/core/prisma/prisma.service";
import { ConfirmCodeDto } from "@libs/contracts/index";
import { BaseRpcException } from "@libs/exeption/index";
import { UserWithConfirmationCode, UserWithPassword } from "@auth/modules/user/dto/user.dto";
import { UserDbInputDto } from "../dto/user-db-input.dto";
import { ConfirmationCodeInputRepoDto } from "../dto/confirm-input-repo.dto";
import { RecoveryCodeInputRepoDto } from "../dto/recovery-input-repo.dto";
import { NewPasswordInputRepoDto } from "../dto/new-pass-input-repo.dto";
import { UserGoogleDbInputDto } from "../dto/user-google-db-input.dto";

@Injectable()
export class PrismaUserCommandRepository implements IUserCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createUser(userDto: UserDbInputDto): Promise<UserWithConfirmationCode> {
		const user = await this.prisma.user.create({
			data: userDto,
		});
		return UserWithConfirmationCode.mapToView(user);
	}

	async createGoogleUser(dto: UserGoogleDbInputDto): Promise<UserWithPassword> {
		const user = await this.prisma.user.create({
			data: dto,
		});
		return UserWithPassword.mapToView(user);
	}

	async confirmEmail(dto: ConfirmCodeDto): Promise<boolean> {
		const { count } = await this.prisma.user.updateMany({
			where: {
				confirmationCode: dto.code,
				confirmationCodeConfirmed: false,
				confirmationCodeExpDate: { gte: new Date() },
			},
			data: {
				confirmationCodeConfirmed: true,
				confirmationCode: null,
				confirmationCodeExpDate: null,
			},
		});

		return count > 0;
	}

	async resendEmail(email: string, newConfirmationCodeBody: ConfirmationCodeInputRepoDto): Promise<string | null> {
		const result = await this.prisma.user.update({
			where: {
				email: email,
			},
			data: newConfirmationCodeBody,
		});

		return result.confirmationCode || null;
	}

	async passwordRecovery(email: string, recoveryCodeBody: RecoveryCodeInputRepoDto): Promise<string | null> {
		const result = await this.prisma.user.update({
			where: {
				email: email,
			},
			data: recoveryCodeBody,
		});

		return result.recoveryCode || null;
	}

	async setNewPassword(userId: string, newPasswordBody: NewPasswordInputRepoDto): Promise<boolean> {
		const result = await this.prisma.user.updateMany({
			where: {
				id: userId,
			},
			data: newPasswordBody,
		});

		if (result.count === 1) return true;

		throw new BaseRpcException(400, "Invalid or expired password recovery code");
	}

	async setGoogleUserId(email: string, googleUserId: string): Promise<boolean> {
		const result = await this.prisma.user.updateMany({
			where: {
				email,
			},
			data: {
				googleUserId,
			},
		});

		if (result.count === 1) return true;

		throw new BaseRpcException(400, "Vailed attempt to login by Google");
	}

	async findUserByEmail(email: string): Promise<UserWithPassword | null> {
		const user = await this.prisma.user.findUnique({
			where: { email },
		});
		if (!user) return null;

		return UserWithPassword.mapToView(user);
	}

	async findUserByEmailOrUserName(email: string, userName: string): Promise<{ field: string } | null> {
		const user = await this.prisma.user.findFirst({
			where: { OR: [{ email }, { userName }] },
		});
		if (!user) return null;
		const field = user.email === email ? "email" : "userName";

		return { field };
	}

	async findUserByRecoveryCode(recoveryCode: string): Promise<UserWithPassword | null> {
		const user = await this.prisma.user.findUnique({
			where: {
				recoveryCode: recoveryCode,
				recoveryCodeExpDate: { gte: new Date() },
			},
		});
		if (!user) return null;

		return UserWithPassword.mapToView(user);
	}
}

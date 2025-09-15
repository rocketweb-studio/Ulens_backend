import { Injectable } from "@nestjs/common";
import { IUserCommandRepository } from "@auth/modules/user/user.interfaces";
import { PrismaService } from "@auth/core/prisma/prisma.service";
import { ConfirmCodeDto } from "@libs/contracts/index";
import { BaseRpcException } from "@libs/exeption/index";
import { UserDbInputDto } from "@auth/modules/user/dto/user-db.input.dto";
import { ConfirmationCodeInputRepoDto } from "../dto/confirm-repo.input.dto";
import { RecoveryCodeInputRepoDto } from "@auth/modules/user/dto/recovery-repo.input.dto";
import { NewPasswordInputRepoDto } from "@auth/modules/user/dto/new-pass-repo.input.dto";
import { UserOauthDbInputDto } from "@auth/modules/user/dto/user-google-db.input.dto";
import { Prisma } from "@auth/core/prisma/generated";
import { UserOutputRepoDto } from "@auth/modules/user/dto/user-repo.ouptut.dto";
import { PaymentSucceededInput } from "../dto/payment-succeeded.output.dto";

type UserWithProfile = Prisma.UserGetPayload<{
	include: { profile: true };
}>;

@Injectable()
export class PrismaUserCommandRepository implements IUserCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createUserAndProfile(userDto: UserDbInputDto): Promise<UserOutputRepoDto> {
		const user = await this.prisma.user.create({
			data: {
				passwordHash: userDto.passwordHash,
				email: userDto.email,
				confirmationCode: userDto.confirmationCode,
				confirmationCodeExpDate: userDto.confirmationCodeExpDate,
				confirmationCodeConfirmed: userDto.confirmationCodeConfirmed,

				profile: {
					create: {
						userName: userDto.userName,
					},
				},
			},
			include: {
				profile: true,
			},
		});

		return this._mapToUse(user);
	}

	async createOauth2UserAndProfile(dto: UserOauthDbInputDto): Promise<UserOutputRepoDto> {
		const { userName, ...rest } = dto;
		const user = await this.prisma.user.create({
			data: {
				...rest,
				profile: {
					create: {
						userName: userName,
					},
				},
			},
			include: {
				profile: true,
			},
		});
		return this._mapToUse(user);
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

	async setOauthUserId(email: string, payload: { [key: string]: string }): Promise<boolean> {
		const result = await this.prisma.user.updateMany({
			where: {
				email,
			},
			data: payload,
		});

		if (result.count === 1) return true;

		throw new BaseRpcException(400, "Vailed attempt to login by Google");
	}

	async findUserByEmail(email: string): Promise<UserOutputRepoDto | null> {
		const user = await this.prisma.user.findUnique({
			where: { email, deletedAt: null },
			include: {
				profile: true,
			},
		});
		if (!user) return null;

		return this._mapToUse(user);
	}

	async findUserByEmailOrUserName(email: string, userName: string): Promise<{ field: string } | null> {
		const user = await this.prisma.user.findFirst({
			where: { OR: [{ email }, { profile: { userName } }], deletedAt: null },
		});
		if (!user) return null;
		const field = user.email === email ? "email" : "userName";

		return { field };
	}

	async findUserByRecoveryCode(recoveryCode: string): Promise<UserOutputRepoDto | null> {
		const user = await this.prisma.user.findUnique({
			where: {
				recoveryCode: recoveryCode,
				recoveryCodeExpDate: { gte: new Date() },
				deletedAt: null,
			},
			include: {
				profile: true,
			},
		});
		if (!user) return null;

		return this._mapToUse(user);
	}

	async deleteNotConfirmedUsers(): Promise<void> {
		const { count } = await this.prisma.user.deleteMany({
			where: {
				confirmationCodeConfirmed: false,
			},
		});

		console.log(`Deleted not confirmed users: [${count}]`);
	}

	async applyPaymentSucceeded(dto: PaymentSucceededInput): Promise<{ premiumUntil: Date }> {
		const { messageId, userId, planCode, occurredAt } = dto;

		return this.prisma.$transaction(async (tx) => {
			// 1) Inbox (идемпотентность)
			try {
				await tx.inboxMessage.create({
					data: {
						id: messageId,
						type: "payment.succeeded",
						source: "payments-service",
						payload: dto as unknown as Prisma.InputJsonValue,
						status: "RECEIVED",
					},
				});
			} catch (e) {
				if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
					// уже обработали — просто вернём текущее premiumUntil
					const u = await tx.user.findUnique({
						where: { id: userId },
						select: { premiumUntil: true },
					});
					return { premiumUntil: u?.premiumUntil ?? new Date() };
				}
				throw e;
			}

			// 2) Считаем новое premiumUntil
			const now = occurredAt ? new Date(occurredAt) : new Date();
			const current = await tx.user.findUnique({
				where: { id: userId },
				select: { premiumUntil: true },
			});
			const base = current?.premiumUntil && current.premiumUntil > now ? current.premiumUntil : now;
			const premiumUntil = new Date(base);
			if (planCode === "PREMIUM_YEAR") premiumUntil.setFullYear(premiumUntil.getFullYear() + 1);
			else premiumUntil.setMonth(premiumUntil.getMonth() + 1);

			// 3) Обновляем пользователя
			await tx.user.update({
				where: { id: userId },
				data: { isPremium: true, premiumUntil },
			});

			// 4) Inbox → PROCESSED
			await tx.inboxMessage.update({
				where: { id: messageId },
				data: { status: "PROCESSED", processedAt: new Date() },
			});

			return { premiumUntil };
		});
	}

	private _mapToUse(user: UserWithProfile): UserOutputRepoDto {
		return {
			id: user.id,
			email: user.email,
			passwordHash: user.passwordHash,
			profile: {
				userName: user.profile?.userName || "",
			},
			confirmationCode: user.confirmationCode,
			confirmationCodeExpDate: user.confirmationCodeExpDate,
			confirmationCodeConfirmed: user.confirmationCodeConfirmed,
			recoveryCode: user.recoveryCode,
			recoveryCodeExpDate: user.recoveryCodeExpDate,
			googleUserId: user.googleUserId,
			githubUserId: user.githubUserId,
		};
	}
}

import { Injectable } from "@nestjs/common";
import { IUserQueryRepository } from "@auth/modules/user/user.interfaces";
import { PrismaService } from "@auth/core/prisma/prisma.service";
import { MeUserViewDto, ProfilePostsDto, UserConfirmationOutputDto, UsersCountOutputDto } from "@libs/contracts/index";
import { Prisma } from "@auth/core/prisma/generated/client";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";

type UserWithProfile = Prisma.UserGetPayload<{
	include: { profile: true };
}>;

@Injectable()
export class PrismaUserQueryRepository implements IUserQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findUserById(id: string): Promise<MeUserViewDto | null> {
		const user = await this.prisma.user.findFirst({
			where: {
				id: id,
				deletedAt: null,
			},
			include: {
				profile: true,
			},
		});

		return user ? this._mapToView(user) : null;
	}

	async getMe(userId: string): Promise<MeUserViewDto> {
		const user = await this.prisma.user.findFirst({
			where: {
				id: userId,
				deletedAt: null,
			},
			include: {
				profile: true,
			},
		});

		if (!user) {
			throw new NotFoundRpcException("User not found");
		}

		return this._mapToView(user);
	}

	async getUsersCount(): Promise<UsersCountOutputDto> {
		const count = await this.prisma.user.count({
			where: {
				deletedAt: null,
			},
		});
		return { count };
	}

	async getProfileForPosts(userId: string): Promise<ProfilePostsDto | null> {
		const profile = await this.prisma.profile.findUnique({
			where: { userId },
			select: {
				userName: true,
				firstName: true,
				lastName: true,
				city: true,
				country: true,
			},
		});
		if (!profile) return null;

		return profile;
	}

	private _mapToView(user: UserWithProfile): MeUserViewDto {
		const isPremium = (user.premiumExpDate && user.premiumExpDate > new Date()) || false;
		return {
			id: user.id,
			userName: user.profile?.userName || "",
			email: user.email,
			isPremium: isPremium,
		};
	}

	async getUserConfirmation(email: string): Promise<UserConfirmationOutputDto> {
		const user = await this.prisma.user.findUnique({
			where: { email },
			select: {
				confirmationCodeConfirmed: true,
			},
		});
		return {
			confirmationCodeConfirmed: user?.confirmationCodeConfirmed || false,
		};
	}
}

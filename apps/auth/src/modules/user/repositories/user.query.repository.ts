import { Injectable } from "@nestjs/common";
import { IUserQueryRepository } from "@auth/modules/user/user.interfaces";
import { PrismaService } from "@auth/core/prisma/prisma.service";
import { MeUserViewDto, ProfilePostsDto, UserConfirmationOutputDto } from "@libs/contracts/index";
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

	async getUsers(): Promise<MeUserViewDto[]> {
		const users = await this.prisma.user.findMany({
			where: {
				deletedAt: null,
			},
			include: {
				profile: true,
			},
		});
		return users.map((user) => this._mapToView(user));
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
				region: true,
			},
		});
		if (!profile) return null;

		return profile;
	}

	private _mapToView(user: UserWithProfile): MeUserViewDto {
		return {
			id: user.id,
			userName: user.profile?.userName || "",
			email: user.email,
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

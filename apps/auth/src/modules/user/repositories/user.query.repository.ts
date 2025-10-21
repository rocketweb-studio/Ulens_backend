import { Injectable } from "@nestjs/common";
import { IUserQueryRepository } from "@auth/modules/user/user.interfaces";
import { PrismaService } from "@auth/core/prisma/prisma.service";
import { MeUserViewDto, ProfilePostsDto, UserConfirmationOutputDto, UsersCountOutputDto } from "@libs/contracts/index";
import { Prisma } from "@auth/core/prisma/generated/client";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";
import { GetUsersQueryGqlDto } from "../dto/get-users-query-gql.dto";
import { FilterByStatus } from "@libs/constants/auth.constants";
import { GetUserOutputDto, GetUsersOutputDto } from "../dto/get-users.ouptut.dto";

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

	async getUsers(input: GetUsersQueryGqlDto): Promise<GetUsersOutputDto> {
		const { search, filterByStatus, pageNumber, pageSize, sortDirection, sortBy } = input;
		const whereCondition = {
			deletedAt: null,
			AND: [
				filterByStatus === FilterByStatus.BLOCKED ? { isBlocked: true } : filterByStatus === FilterByStatus.NOT_BLOCKED ? { isBlocked: false } : {},

				search
					? {
							OR: [
								{ email: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
								{ id: { contains: search } },
								{
									profile: {
										userName: { contains: search, mode: "insensitive" as Prisma.QueryMode },
									},
								},
							],
						}
					: {},
			],
		};

		const orderBy = {
			[sortBy]: sortDirection,
		};

		const users = await this.prisma.user.findMany({
			where: whereCondition,
			include: {
				profile: true,
			},
			orderBy: orderBy,
			take: pageSize,
			skip: (pageNumber - 1) * pageSize,
		});

		const mappedUsers: GetUserOutputDto[] = users.map((user) => ({
			id: user.id,
			userName: user.profile?.userName || null,
			createdAt: user.createdAt.toISOString(),
			isBlocked: user.isBlocked,
		}));

		const usersCount = await this.prisma.user.count({
			where: whereCondition,
		});
		return {
			totalCount: usersCount,
			page: pageNumber,
			pageSize: pageSize,
			items: mappedUsers,
		};
	}
}

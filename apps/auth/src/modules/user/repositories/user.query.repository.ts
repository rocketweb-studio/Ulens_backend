import { Injectable } from "@nestjs/common";
import { IUserQueryRepository } from "@auth/modules/user/user.interfaces";
import { PrismaService } from "@auth/core/prisma/prisma.service";
import {
	FollowersOutputDto,
	FollowingsOutputDto,
	GetFollowersOutputDto,
	GetFollowingsOutputDto,
	MeUserViewDto,
	ProfilePostsDto,
	SearchUsersInputDto,
	SearchUsersOutputDto,
	UserConfirmationOutputDto,
	UsersCountOutputDto,
} from "@libs/contracts/index";
import { Prisma } from "@auth/core/prisma/generated/client";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";
import { GetUsersQueryGqlDto } from "../dto/get-users-query-gql.dto";
import { FilterByStatus, SortabeFieldsForUsers } from "@libs/constants/auth.constants";
import { GetUserOutputDto, GetUsersOutputDto } from "@auth/modules/user/dto/get-users.ouptut.dto";
import { UserQueryHelper } from "./user.query.repo.helper";
import { GetFollowQueryInputDto } from "@libs/contracts/auth-contracts/input/get-follow.query.input.dto";

type UserWithProfile = Prisma.UserGetPayload<{
	include: { profile: true };
}>;

@Injectable()
export class PrismaUserQueryRepository implements IUserQueryRepository {
	constructor(
		private readonly prisma: PrismaService,
		private readonly helpers: UserQueryHelper,
	) {}

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

		// Handle sorting by userName differently since it's on the Profile model
		const orderBy = sortBy === SortabeFieldsForUsers.USER_NAME ? { profile: { userName: sortDirection } } : { [sortBy]: sortDirection };

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
			firstName: user.profile?.firstName || null,
			lastName: user.profile?.lastName || null,
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

	async getUsersBySearch(dto: SearchUsersInputDto): Promise<SearchUsersOutputDto> {
		const { endCursorUserId, pageSize, search } = dto;

		if (!search) {
			return this.helpers.buildPage(0, pageSize, []);
		}
		if (!endCursorUserId) {
			const [totalCount, rows] = await this.helpers.getFirstPage(
				{ userName: { contains: search, mode: "insensitive" as Prisma.QueryMode }, deletedAt: null },
				pageSize,
			);
			return this.helpers.buildPage(totalCount, pageSize, rows);
		}
		const cursor = await this.helpers.resolveCursor(
			{ userName: { contains: search, mode: "insensitive" as Prisma.QueryMode }, deletedAt: null },
			endCursorUserId,
		);

		if (!cursor) {
			const [totalCount, rows] = await this.helpers.getFirstPage(
				{ userName: { contains: search, mode: "insensitive" as Prisma.QueryMode }, deletedAt: null },
				pageSize,
			);
			return this.helpers.buildPage(totalCount, pageSize, rows);
		}

		const [totalCount, rows] = await this.helpers.getPageAfterCursor(
			{ userName: { contains: search, mode: "insensitive" as Prisma.QueryMode }, deletedAt: null },
			cursor,
			pageSize,
		);
		return this.helpers.buildPage(totalCount, pageSize, rows);
	}

	async getFollowers(userId: string, query: GetFollowQueryInputDto): Promise<GetFollowersOutputDto> {
		const { pageNumber, pageSize } = query;
		const followers = await this.prisma.follow.findMany({
			where: { followingId: userId },
			include: { follower: { include: { profile: true } } },
			orderBy: {
				createdAt: "desc",
			},
			take: pageSize,
			skip: (pageNumber - 1) * pageSize,
		});

		const totalCount = await this.prisma.follow.count({
			where: { followingId: userId },
		});
		return {
			totalCount,
			pageSize,
			pageNumber,
			items: this._mapFolowersToView(followers),
		};
	}

	async getFollowings(userId: string, query: GetFollowQueryInputDto): Promise<GetFollowingsOutputDto> {
		const { pageNumber, pageSize } = query;
		const followings = await this.prisma.follow.findMany({
			where: { followerId: userId },
			include: { following: { include: { profile: true } } },
			orderBy: {
				createdAt: "desc",
			},
			take: pageSize,
			skip: (pageNumber - 1) * pageSize,
		});

		const totalCount = await this.prisma.follow.count({
			where: { followerId: userId },
		});
		return {
			totalCount,
			pageSize,
			pageNumber,
			items: this._mapFollowingsToView(followings),
		};
	}

	async getAllFollowings(userId: string): Promise<FollowersOutputDto[]> {
		const followings = await this.prisma.follow.findMany({
			where: { followerId: userId },
			include: { following: { include: { profile: true } } },
		});
		return this._mapFollowingsToView(followings);
	}

	private _mapFolowersToView(followers: any[]): FollowersOutputDto[] {
		return followers.map((follower) => ({
			id: follower.followerId,
			userName: follower.profile?.userName || null,
			createdAt: follower.createdAt.toISOString(),
			firstName: follower.profile?.firstName || null,
			lastName: follower.profile?.lastName || null,
			city: follower.profile?.city || null,
			country: follower.profile?.country || null,
			dateOfBirth: follower.profile?.dateOfBirth || null,
			aboutMe: follower.profile?.aboutMe || null,
		}));
	}

	private _mapFollowingsToView(followings: any[]): FollowingsOutputDto[] {
		return followings.map((following) => ({
			id: following.followingId,
			userName: following.following.profile?.userName || null,
			createdAt: following.createdAt.toISOString(),
			firstName: following.following.profile?.firstName || null,
			lastName: following.following.profile?.lastName || null,
			city: following.following.profile?.city || null,
			country: following.following.profile?.country || null,
			dateOfBirth: following.following.profile?.dateOfBirth || null,
			aboutMe: following.following.profile?.aboutMe || null,
		}));
	}
}

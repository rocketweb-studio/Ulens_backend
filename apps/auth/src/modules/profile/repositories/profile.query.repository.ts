import { Injectable } from "@nestjs/common";
import { IProfileQueryRepository } from "@auth/modules/profile/profile.interfaces";
import { PrismaService } from "@auth/core/prisma/prisma.service";
import { Profile } from "@auth/core/prisma/generated/client";
import { ProfileOutputDto } from "@libs/contracts/auth-contracts/output/profile.output.dto";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";
import { Prisma } from "@auth/core/prisma/generated";

@Injectable()
export class PrismaProfileQueryRepository implements IProfileQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getProfileByUserId(userId: string): Promise<ProfileOutputDto> {
		const [profile, followersCount, followingCount] = await Promise.all([
			this.prisma.profile.findFirst({
				where: { userId, user: { deletedAt: null } },
			}),
			this.prisma.follow.count({
				where: {
					followingId: userId,
					following: { deletedAt: null },
					follower: { deletedAt: null },
				},
			}),
			this.prisma.follow.count({
				where: {
					followerId: userId,
					following: { deletedAt: null },
					follower: { deletedAt: null },
				},
			}),
		]);
		if (!profile) throw new NotFoundRpcException("Profile not found");
		return this._mapToView(profile, followersCount, followingCount);
	}

	async getProfiles(userIds: string[]): Promise<Omit<ProfileOutputDto, "followers" | "following">[]> {
		const profiles = await this.prisma.profile.findMany({
			where: { userId: { in: userIds }, deletedAt: null },
		});
		return profiles.map(this._mapToViewWithoutFollowersAndFollowing);
	}

	async getProfilesByUserName(userName: string): Promise<Omit<ProfileOutputDto, "followers" | "following">[]> {
		const profiles = await this.prisma.profile.findMany({
			where: { userName: { contains: userName, mode: "insensitive" as Prisma.QueryMode }, deletedAt: null },
		});
		return profiles.map(this._mapToViewWithoutFollowersAndFollowing);
	}

	private _mapToView(profile: Profile, followersCount: number, followingCount: number): ProfileOutputDto {
		const formatDate = (date: Date): string => {
			const day = String(date.getDate()).padStart(2, "0");
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const year = date.getFullYear();
			return `${day}.${month}.${year}`;
		};
		return {
			id: profile.userId,
			userName: profile.userName,
			firstName: profile.firstName,
			lastName: profile.lastName,
			city: profile.city || "",
			country: profile.country || "",
			dateOfBirth: profile.dateOfBirth ? formatDate(profile.dateOfBirth) : null,
			aboutMe: profile.aboutMe,
			createdAt: profile.createdAt,
			followers: followersCount,
			following: followingCount,
		};
	}
	private _mapToViewWithoutFollowersAndFollowing(profile: Profile): Omit<ProfileOutputDto, "followers" | "following"> {
		const formatDate = (date: Date): string => {
			const day = String(date.getDate()).padStart(2, "0");
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const year = date.getFullYear();
			return `${day}.${month}.${year}`;
		};
		return {
			id: profile.userId,
			userName: profile.userName,
			firstName: profile.firstName,
			lastName: profile.lastName,
			city: profile.city || "",
			country: profile.country || "",
			dateOfBirth: profile.dateOfBirth ? formatDate(profile.dateOfBirth) : null,
			aboutMe: profile.aboutMe,
			createdAt: profile.createdAt,
		};
	}
}

import { Injectable } from "@nestjs/common";
import { PrismaService } from "@main/core/prisma/prisma.service";
import { ILikeQueryRepository } from "../like.interface";
import { GetLikesByItemIdInputDto, GetLikesByItemIdsInputDto } from "../dto/get-likes.input.dto";

@Injectable()
export class PrismaLikeQueryRepository implements ILikeQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getLikesByItemId(dto: GetLikesByItemIdInputDto): Promise<{ userId: string }[]> {
		return await this.prisma.like.findMany({
			where: { parentType: dto.likedItemType, parentId: dto.likedItemId },
			select: {
				userId: true,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 3,
		});
	}

	async getLikesByItemIds(dto: GetLikesByItemIdsInputDto): Promise<{ postId: string; users: string[] }[]> {
		const likes = await Promise.all(
			dto.likedItemIds.map(async (likedItemId) => {
				return await this.prisma.like.findMany({
					where: { parentType: dto.likedItemType, parentId: likedItemId },
					select: {
						userId: true,
						parentId: true,
					},
					orderBy: {
						createdAt: "desc",
					},
					take: 3,
				});
			}),
		);

		const result = likes
			.filter((like) => like.length > 0) // Filter out empty arrays
			.map((like) => ({
				postId: like[0].parentId,
				users: like.map((l) => l.userId),
			}));

		return result;
	}
}

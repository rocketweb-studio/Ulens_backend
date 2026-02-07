import { Injectable } from "@nestjs/common";
import { PrismaService } from "@main/core/prisma/prisma.service";
import { ILikeCommandRepository } from "../like.interface";
import { LikeInputDto } from "../dto/like.input.dto";

@Injectable()
export class PrismaLikeCommandRepository implements ILikeCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createLike(dto: LikeInputDto): Promise<boolean> {
		const like = await this.prisma.like.create({
			data: {
				userId: dto.userId,
				parentType: dto.likedItemType,
				parentId: dto.likedItemId,
			},
		});
		return !!like.id;
	}

	async deleteLike(dto: LikeInputDto): Promise<boolean> {
		const { count } = await this.prisma.like.deleteMany({
			where: { userId: dto.userId, parentType: dto.likedItemType, parentId: dto.likedItemId },
		});
		return count === 1;
	}

	async findLike(dto: LikeInputDto): Promise<boolean> {
		const like = await this.prisma.like.findUnique({
			where: { unique_user_like: { userId: dto.userId, parentType: dto.likedItemType, parentId: dto.likedItemId } },
		});
		return !!like;
	}
}

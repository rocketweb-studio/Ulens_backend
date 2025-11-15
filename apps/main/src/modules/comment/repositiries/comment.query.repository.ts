import { Injectable } from "@nestjs/common";
import { PrismaService } from "@main/core/prisma/prisma.service";
import { ICommentQueryRepository } from "../comment.interface";
import { CreateCommentDbOutputDto } from "../dto/create-comment-db.output.dto";
import { LikedItemType } from "@libs/contracts/index";

@Injectable()
export class PrismaCommentQueryRepository implements ICommentQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getCommentById(id: string): Promise<CreateCommentDbOutputDto | null> {
		const comment = await this.prisma.comment.findUnique({
			where: { id, deletedAt: null },
			select: { id: true, userId: true, postId: true, content: true, createdAt: true },
		});

		return comment as CreateCommentDbOutputDto | null;
	}

	async getPostComments(userId: string | null, postId: string): Promise<CreateCommentDbOutputDto & { likeCount: number; isLiked: boolean }[]> {
		const comments = await this.prisma.comment.findMany({
			where: { postId, deletedAt: null },
			orderBy: { createdAt: "desc" },
			select: { id: true, userId: true, postId: true, content: true, createdAt: true },
		});
		const commentsWithLikesCount = await Promise.all(
			comments.map(async (comment) => ({ ...comment, likeCount: await this.getLikesCount(comment.id), isLiked: await this.isLiked(userId, comment.id) })),
		);

		if (userId) {
			// Separate user's comments from others
			const userComments = commentsWithLikesCount.filter((comment) => comment.userId === userId);
			const otherComments = commentsWithLikesCount.filter((comment) => comment.userId !== userId);
			// User's comments first, then others (both already sorted by createdAt desc)
			return [...userComments, ...otherComments] as unknown as CreateCommentDbOutputDto & { likeCount: number; isLiked: boolean }[];
		}

		return commentsWithLikesCount as unknown as CreateCommentDbOutputDto & { likeCount: number; isLiked: boolean }[];
	}

	async getPostsCommentsCount(postIds: string[]): Promise<{ postId: string; commentsCount: number }[]> {
		const commentsCount = await this.prisma.comment.groupBy({
			by: ["postId"],
			_count: true,
			where: { postId: { in: postIds }, deletedAt: null },
		});
		return commentsCount.map((comment) => ({ postId: comment.postId, commentsCount: comment._count }));
	}

	private async getLikesCount(id: string): Promise<number> {
		return this.prisma.like.count({
			where: { parentType: LikedItemType.COMMENT, parentId: id },
		});
	}

	private async isLiked(userId: string | null, commentId: string): Promise<boolean> {
		if (!userId) return false;
		const like = await this.prisma.like.findFirst({
			where: { userId, parentType: LikedItemType.COMMENT, parentId: commentId },
		});
		return !!like;
	}
}

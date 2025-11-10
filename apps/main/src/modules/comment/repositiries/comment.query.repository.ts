import { Injectable } from "@nestjs/common";
import { PrismaService } from "@main/core/prisma/prisma.service";
import { ICommentQueryRepository } from "../comment.interface";
import { CreateCommentDbOutputDto } from "../dto/create-comment-db.output.dto";

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

	async getPostComments(userId: string | null, postId: string): Promise<CreateCommentDbOutputDto[]> {
		const comments = await this.prisma.comment.findMany({
			where: { postId, deletedAt: null },
			orderBy: { createdAt: "desc" },
			select: { id: true, userId: true, postId: true, content: true, createdAt: true },
		});

		if (userId) {
			// Separate user's comments from others
			const userComments = comments.filter((comment) => comment.userId === userId);
			const otherComments = comments.filter((comment) => comment.userId !== userId);
			// User's comments first, then others (both already sorted by createdAt desc)
			return [...userComments, ...otherComments] as CreateCommentDbOutputDto[];
		}

		return comments as CreateCommentDbOutputDto[];
	}
}

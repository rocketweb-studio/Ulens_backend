import { Injectable } from "@nestjs/common";
import { PrismaService } from "@main/core/prisma/prisma.service";
import { ICommentCommandRepository } from "../comment.interface";
import { CreatePostCommentInputDto } from "@main/modules/post/dto/create-post-comment.input.dto";

@Injectable()
export class PrismaCommentCommandRepository implements ICommentCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createComment(dto: CreatePostCommentInputDto): Promise<string> {
		console.log("CALL createComment", dto);
		const comment = await this.prisma.comment.create({
			data: { userId: dto.userId, postId: dto.postId, content: dto.content },
			select: { id: true },
		});
		return comment.id;
	}

	async deleteDeletedComments(): Promise<void> {
		const { count } = await this.prisma.comment.deleteMany({
			where: { deletedAt: { not: null } },
		});
		console.log(`Deleted deleted comments: [${count}]`);
	}

	async softDeleteUserComments(userId: string): Promise<boolean> {
		const { count } = await this.prisma.comment.updateMany({
			where: { userId, deletedAt: null },
			data: { deletedAt: new Date() },
		});
		return count === 1;
	}

	// private mapToView(comment: Comment): CommentOutputDto {
	// 	return {
	// 		id: comment.id,
	// 		commentatorId: comment.userId,
	// 		postId: comment.postId,
	// 		content: comment.content,
	// 		createdAt: comment.createdAt,
	// 	};
	// }
}

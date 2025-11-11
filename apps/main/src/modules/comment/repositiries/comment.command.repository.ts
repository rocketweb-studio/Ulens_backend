import { Injectable } from "@nestjs/common";
import { PrismaService } from "@main/core/prisma/prisma.service";
import { ICommentCommandRepository } from "../comment.interface";
import { CreatePostCommentInputDto } from "@main/modules/post/dto/create-post-comment.input.dto";
import { IOutboxCommandRepository } from "@main/modules/event-store/outbox.interface";
import { PostDbOutputDto } from "@libs/contracts/index";

@Injectable()
export class PrismaCommentCommandRepository implements ICommentCommandRepository {
	constructor(
		private readonly prisma: PrismaService,
		private readonly outboxCommandRepository: IOutboxCommandRepository,
	) {}

	async createComment(dto: CreatePostCommentInputDto, post: PostDbOutputDto): Promise<string> {
		const comment = await this.prisma.$transaction(async (tx) => [
			await tx.comment.create({
				data: { userId: dto.userId, postId: dto.postId, content: dto.content },
				select: { id: true },
			}),
			await this.outboxCommandRepository.createOutboxCommentEvent(tx, {
				userId: post.userId,
				commentatorId: dto.userId,
				commentatorUserName: dto.userName,
				postId: post.id,
				postDescription: post.description,
			}),
		]);

		return (comment[0] as { id: string }).id;
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
}

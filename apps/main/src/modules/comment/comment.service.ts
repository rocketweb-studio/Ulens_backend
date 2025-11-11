import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ICommentCommandRepository } from "./comment.interface";
import { CreatePostCommentInputDto } from "../post/dto/create-post-comment.input.dto";
import { PostDbOutputDto } from "@libs/contracts/index";

@Injectable()
export class CommentService {
	constructor(private readonly commentCommandRepository: ICommentCommandRepository) {}

	async createComment(dto: CreatePostCommentInputDto, post: PostDbOutputDto): Promise<string> {
		const result = await this.commentCommandRepository.createComment(dto, post);
		return result;
	}

	async softDeleteUserComments(userId: string): Promise<boolean> {
		const result = await this.commentCommandRepository.softDeleteUserComments(userId);
		return result;
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async deleteDeletedComments() {
		await this.commentCommandRepository.deleteDeletedComments();
	}
}

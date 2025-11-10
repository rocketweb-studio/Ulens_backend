import { CreatePostCommentInputDto } from "@main/modules/post/dto/create-post-comment.input.dto";
import { CreateCommentDbOutputDto } from "./dto/create-comment-db.output.dto";

export abstract class ICommentQueryRepository {
	abstract getCommentById(id: string): Promise<CreateCommentDbOutputDto | null>;
	abstract getPostComments(userId: string | null, postId: string): Promise<CreateCommentDbOutputDto[]>;
}

export abstract class ICommentCommandRepository {
	abstract createComment(dto: CreatePostCommentInputDto): Promise<string>;
	abstract deleteDeletedComments(): Promise<void>;
	abstract softDeleteUserComments(userId: string): Promise<boolean>;
}

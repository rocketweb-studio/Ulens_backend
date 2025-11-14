import { CreatePostCommentInputDto } from "@main/modules/post/dto/create-post-comment.input.dto";
import { CreateCommentDbOutputDto } from "./dto/create-comment-db.output.dto";
import { PostDbOutputDto } from "@libs/contracts/index";

export abstract class ICommentQueryRepository {
	abstract getCommentById(id: string): Promise<CreateCommentDbOutputDto | null>;
	abstract getPostComments(userId: string | null, postId: string): Promise<CreateCommentDbOutputDto & { likeCount: number; isLiked: boolean }[]>;
	abstract getPostsCommentsCount(postIds: string[]): Promise<{ postId: string; commentsCount: number }[]>;
}

export abstract class ICommentCommandRepository {
	abstract createComment(dto: CreatePostCommentInputDto, post: PostDbOutputDto): Promise<string>;
	abstract deleteDeletedComments(): Promise<void>;
	abstract softDeleteUserComments(userId: string): Promise<boolean>;
}

export class CreatePostCommentInputDto {
	userId: string;
	content: string;
	replyToCommentId?: string | null;
	postId: string;
	userName: string;
	targerUser: { id: string; userName: string };
}

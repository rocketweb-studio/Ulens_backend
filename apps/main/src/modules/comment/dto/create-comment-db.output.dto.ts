export class CreateCommentDbOutputDto {
	id: string;
	userId: string;
	postId: string;
	replyToCommentId?: string | null;
	content: string;
	createdAt: Date;
}

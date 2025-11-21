export class CreateCommentDbOutputDto {
	id: string;
	userId: string;
	postId: string;
	content: string;
	createdAt: Date;
}

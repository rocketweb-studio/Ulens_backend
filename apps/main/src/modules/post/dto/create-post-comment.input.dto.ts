export class CreatePostCommentInputDto {
	userId: string;
	content: string;
	postId: string;
	userName: string;
	targerUser: { id: string; userName: string };
}

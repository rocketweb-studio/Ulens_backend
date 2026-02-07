export class CreateOutboxCommentEventDto {
	userId: string;
	commentatorId: string;
	commentatorUserName: string;
	postId: string;
	postDescription: string;
}

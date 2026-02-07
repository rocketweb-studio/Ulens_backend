export class PostDbOutputDto {
	id: string;
	userId: string;
	description: string;
	createdAt: Date; // или string (ISO), если гоняете по сети
	updatedAt: Date; // или string (ISO), если гоняете по сети
	likeCount: number;
	isLiked: boolean;
}

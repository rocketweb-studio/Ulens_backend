export class UserPostsPageDto {
	totalCount: number;
	pageSize: number;
	items: {
		id: string;
		userId: string;
		description: string;
		createdAt: Date; // ISO
		updatedAt: Date; // ISO
		likeCount: number;
		isLiked: boolean;
	}[];
	pageInfo: {
		endCursorPostId?: string;
		hasNextPage: boolean;
	};
}

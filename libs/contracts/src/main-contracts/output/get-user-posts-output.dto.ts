export class UserPostsPageDto {
	totalCount: number;
	pageSize: number;
	items: {
		id: string;
		userId: string;
		description: string;
		createdAt: Date; // ISO
		updatedAt: Date; // ISO
	}[];
	pageInfo: {
		endCursorPostId?: string;
		hasNextPage: boolean;
	};
}

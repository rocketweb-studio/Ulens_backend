export class UserPostsPageDto {
	totalCount: number;
	pageSize: number;
	items: {
		id: string;
		description: string;
		createdAt: string; // ISO
		updatedAt: string; // ISO
	}[];
	pageInfo: {
		endCursorPostId?: string;
		hasNextPage: boolean;
	};
}

export class GetUserPostsInputDto {
	userId: string;
	pageSize?: number;
	endCursorPostId?: string;
	sortBy?: "createdAt" | "description";
	sortDirection?: "asc" | "desc";
}

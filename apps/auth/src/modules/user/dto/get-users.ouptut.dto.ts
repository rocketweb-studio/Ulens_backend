export class GetUserOutputDto {
	id: string;
	userName: string | null;
	createdAt: string;
	isBlocked: boolean;
}

export class GetUsersOutputDto {
	totalCount: number;
	page: number;
	pageSize: number;
	items: GetUserOutputDto[];
}

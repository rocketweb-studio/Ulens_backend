import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";
import { Type } from "class-transformer";

enum SortDirection {
	ASC = "asc",
	DESC = "desc",
}

export class GetUserPostsQueryDto {
	@ApiPropertyOptional({ description: "page size is number of items that should be returned", default: 10 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(10)
	pageSize?: number = 10;

	@ApiPropertyOptional({
		description: "Cursor (postId) of the last item from previous page. If omitted — the first page is returned",
		format: "uuid",
	})
	@IsOptional()
	@IsUUID("4")
	endCursorPostId?: string;

	@ApiPropertyOptional({
		description: "Sort by parameters (deprecated, ignored by server)",
		example: "createdAt",
		deprecated: true,
	})
	@IsOptional()
	@IsString()
	sortBy?: string;

	@ApiPropertyOptional({
		description: "Sort by desc or asc (deprecated, ignored by server)",
		enum: SortDirection,
		default: SortDirection.DESC,
		deprecated: true,
	})
	@IsOptional()
	@IsEnum(SortDirection)
	sortDirection?: SortDirection = SortDirection.DESC;
}

export class GetFollowingsPostsQueryDto {
	@ApiPropertyOptional({ description: "page size is number of items that should be returned", default: 10 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(10)
	pageSize: number = 10;

	@ApiPropertyOptional({
		description: "Cursor (postId) of the last item from previous page. If omitted — the first page is returned",
		format: "uuid",
	})
	@IsOptional()
	@IsUUID("4")
	endCursorPostId?: string;
}

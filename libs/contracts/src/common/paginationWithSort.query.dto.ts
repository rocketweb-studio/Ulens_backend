import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { Type } from "class-transformer";
import { SortableTransactionFields } from "@libs/contracts/payments-contracts/output/transaction.output.dto";

enum SortDirection {
	ASC = "asc",
	DESC = "desc",
}

export class PaginationWithSortQueryDto {
	@ApiPropertyOptional({ description: "page number is number of page that should be returned", default: 1 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	pageNumber: number = 1;

	@ApiPropertyOptional({ description: "page size is number of items that should be returned", default: 10 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(10)
	pageSize: number = 10;

	@ApiPropertyOptional({
		description: "Sort by parameters",
		example: "createdAt",
	})
	@IsOptional()
	@IsEnum(SortableTransactionFields)
	@IsString()
	sortBy: string = "createdAt";

	@ApiPropertyOptional({
		description: "Sort by desc or asc",
		enum: SortDirection,
		default: SortDirection.DESC,
	})
	@IsOptional()
	@IsEnum(SortDirection)
	sortDirection: SortDirection = SortDirection.DESC;
}

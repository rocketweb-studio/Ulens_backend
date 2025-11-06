import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class GetFollowQueryInputDto {
	@ApiPropertyOptional({
		description: "Page size",
		example: 10,
		default: 10,
	})
	@IsOptional()
	@Type(() => Number)
	pageSize: number = 10;

	@ApiPropertyOptional({
		description: "Page number",
		example: 1,
		default: 1,
	})
	@IsOptional()
	@Type(() => Number)
	pageNumber: number = 1;
}

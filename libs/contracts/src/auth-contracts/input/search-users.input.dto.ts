import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class SearchUsersInputDto {
	@ApiProperty({
		type: "string",
		format: "uuid",
		description: "End cursor user id",
		example: "123e4567-e89b-12d3-a456-426614174000",
		required: false,
	})
	@IsString()
	@IsOptional()
	endCursorUserId?: string;

	@ApiProperty({
		type: "string",
		description: "Page size",
		example: "10",
		default: "10",
		required: false,
	})
	@IsOptional()
	pageSize: number = 10;

	@ApiProperty({
		type: "string",
		description: "Search",
		example: "John",
		default: "",
		required: false,
	})
	@IsString()
	@IsOptional()
	search: string = "";
}

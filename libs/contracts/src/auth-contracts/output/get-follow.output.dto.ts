import { ApiProperty } from "@nestjs/swagger";

export class FollowersOutputDto {
	@ApiProperty({ description: "User ID", example: "123e4567-e89b-12d3-a456-426614174000" })
	id: string;
	@ApiProperty({ description: "User name", example: "JohnDoe" })
	userName: string;
	@ApiProperty({ description: "Created at", example: "2021-01-01T00:00:00.000Z" })
	createdAt: string;
	@ApiProperty({ description: "First name", example: "John" })
	firstName: string;
	@ApiProperty({ description: "Last name", example: "Doe" })
	lastName: string;
	@ApiProperty({ description: "City", example: "New York" })
	city: string;
	@ApiProperty({ description: "Country", example: "USA" })
	country: string;
	@ApiProperty({ description: "Date of birth", example: "08.28.2007" })
	dateOfBirth: string;
	@ApiProperty({ description: "About me", example: "I am a software engineer" })
	aboutMe: string;
}

export class FollowingsOutputDto extends FollowersOutputDto {}

export class GetFollowersOutputDto {
	@ApiProperty({ description: "Total count", example: 100 })
	totalCount: number;
	@ApiProperty({ description: "Page size", example: 10 })
	pageSize: number;
	@ApiProperty({ description: "Page number", example: 1 })
	pageNumber: number;
	@ApiProperty({ description: "Items", type: [FollowersOutputDto] })
	items: FollowersOutputDto[];
}

export class GetFollowingsOutputDto {
	@ApiProperty({ description: "Total count", example: 100 })
	totalCount: number;
	@ApiProperty({ description: "Page size", example: 10 })
	pageSize: number;
	@ApiProperty({ description: "Page number", example: 1 })
	pageNumber: number;
	@ApiProperty({ description: "Items", type: [FollowingsOutputDto] })
	items: FollowingsOutputDto[];
}

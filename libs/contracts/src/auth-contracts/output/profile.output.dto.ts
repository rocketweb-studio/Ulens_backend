import { ApiProperty } from "@nestjs/swagger";

enum FilesSizes {
	SMALL = "small",
	MEDIUM = "medium",
	LARGE = "large",
}

export class ProfileOutputDto {
	@ApiProperty({ description: "User name", example: "JohnDoe" })
	userName: string;
	@ApiProperty({ description: "User ID", example: "123e4567-e89b-12d3-a456-426614174000" })
	id: string;
	@ApiProperty({ description: "First name", example: "John" })
	firstName: string | null;
	@ApiProperty({ description: "Last name", example: "Doe" })
	lastName: string | null;
	@ApiProperty({ description: "City", example: "New York" })
	city: string | null;
	@ApiProperty({ description: "Country", example: "USA" })
	country: string | null;
	@ApiProperty({ description: "Region", example: "NY" })
	region: string | null;
	@ApiProperty({ description: "Date of birth", example: "2000-01-01" })
	dateOfBirth: Date | null;
	@ApiProperty({ description: "About me", example: "I am a software engineer" })
	aboutMe: string | null;
	@ApiProperty({ description: "Created at", example: "2021-01-01T00:00:00.000Z" })
	createdAt: Date | null;
}

export class AvatarOutputDto {
	@ApiProperty({ description: "URL", example: "folder/image.jpg" })
	url: string;
	@ApiProperty({ description: "Width", example: 300 })
	width: number;
	@ApiProperty({ description: "Height", example: 300 })
	height: number;
	@ApiProperty({ description: "File size", example: 300 })
	fileSize: number;
	@ApiProperty({ description: "Size", example: "small", enum: FilesSizes, enumName: "FilesSizes" })
	size: FilesSizes;
	@ApiProperty({ description: "Created at", example: "2021-01-01T00:00:00.000Z" })
	createdAt: Date;
}

export class ProfileOutputWithAvatarDto extends ProfileOutputDto {
	@ApiProperty({ description: "Avatars", type: [AvatarOutputDto] })
	avatars: AvatarOutputDto[];
	@ApiProperty({ description: "Publications count", example: 10 })
	publicationsCount: number;
	@ApiProperty({ description: "Followers count", example: 10 })
	followers: number;
	@ApiProperty({ description: "Following count", example: 10 })
	following: number;
}

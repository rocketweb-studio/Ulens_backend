import { ApiProperty } from "@nestjs/swagger";

export class ProfileOutputDto {
	@ApiProperty({ description: "User name", example: "John Doe" })
	userName: string;
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
	@ApiProperty({ description: "URL", example: "https://example.com/image.jpg" })
	url: string;
	@ApiProperty({ description: "Width", example: 300 })
	width: number;
	@ApiProperty({ description: "Height", example: 300 })
	height: number;
	@ApiProperty({ description: "File size", example: 300 })
	fileSize: number;
	@ApiProperty({ description: "Created at", example: "2021-01-01T00:00:00.000Z" })
	createdAt: Date;
}

export class ProfileOutputWithAvatarDto extends ProfileOutputDto {
	@ApiProperty({ description: "Avatars" })
	avatars: AvatarOutputDto;
}

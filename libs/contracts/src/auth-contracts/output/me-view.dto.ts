import { ApiProperty } from "@nestjs/swagger";

export class MeUserViewDto {
	@ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
	id: string;
	@ApiProperty({ example: "user.email@gmail.com" })
	email: string;
	@ApiProperty({ example: "JohnDoe" })
	userName: string;

	@ApiProperty({ example: true })
	isPremium: boolean;
}

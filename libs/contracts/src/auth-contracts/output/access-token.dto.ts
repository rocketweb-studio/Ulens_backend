import { ApiProperty } from "@nestjs/swagger";

export class AccessTokenDto {
	@ApiProperty({
		description: "Access token of the user",
		example: "accessToken",
	})
	accessToken: string;
}

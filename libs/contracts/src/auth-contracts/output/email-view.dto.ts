import { ApiProperty } from "@nestjs/swagger";

export class EmailDto {
	@ApiProperty({
		description: "email",
		example: "email@gmail.com",
	})
	email: string;
}

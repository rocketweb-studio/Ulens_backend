import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail } from "class-validator";

export class ResendEmailDto {
	@ApiProperty({
		example: "user.example@gmail.com",
		pattern: "^[^\s@]+@[^\s@]+\.[^\s@]+$",
	})
	@IsEmail()
	@IsString()
	email: string;
}

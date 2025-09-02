import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class RecoveryPasswordDto {
	@ApiProperty({
		example: "user.example@gmail.com",
		pattern: "^[^\s@]+@[^\s@]+\.[^\s@]+$",
	})
	@IsEmail()
	@IsString()
	email: string;

	@ApiProperty({
		example: "123456",
	})
	@IsString()
	recaptchaToken: string;
}

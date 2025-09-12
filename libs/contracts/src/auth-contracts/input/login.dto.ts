import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
	@ApiProperty({
		example: "user.email@gmail.com",
		format: "email",
		description: "Unique email",
	})
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;

	@ApiProperty({
		example: "MyP@ssw0rd!2025#",
		description: "User password",
	})
	@IsString()
	@IsNotEmpty()
	password: string;
}

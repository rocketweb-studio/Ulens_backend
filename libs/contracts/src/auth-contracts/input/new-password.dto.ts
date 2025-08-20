import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, Length } from "class-validator";
import { Trim } from "../../utils/trim-pipe";

export class NewPasswordDto {
	@ApiProperty({
		example: "MyP@ssw0rd!2025#",
		description: "User password",
		minLength: 6,
		maxLength: 20,
		pattern: "^[0-9A-Za-z!\"#$%&'()*+,\\-./:;<=>?@[\\]\\\\^_{|}~]+$",
	})
	@Trim()
	@IsString()
	@Length(6, 20)
	@Matches(/^[0-9A-Za-z!"#$%&'()*+,\-./:;<=>?@[\]\\^_{|}~]+$/, {
		message: "Allowed characters: 0-9, A-Z, a-z and special symbols ! \" # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ { | } ~",
	})
	newPassword: string;

	@ApiProperty({
		pattern: "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
	})
	@IsString()
	@Matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
	recoveryCode: string;
}

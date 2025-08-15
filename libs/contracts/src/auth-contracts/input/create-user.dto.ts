import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, Matches, IsEmail } from "class-validator";
// ? import { Trim } from "@libs/utils/index" так и не получилось импортировать этот pipe из либы


export class CreateUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'User name',
    minLength: 6,
    maxLength: 30,
    pattern: '^[a-zA-Z0-9_-]*$'
  })
  // @Trim()
  @IsString()
  @Length(6, 30)
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message: 'name allows only letters, numbers, _ and -'
  })
  userName: string;

  @ApiProperty({
    example: 'user.email@gmail.com',
    format: 'email',
    description: 'Unique email'
  })
  // @Trim()
  @IsEmail()
  email: string;

  @ApiProperty({
    example:'MyP@ssw0rd!2025#',
    description: 'User password',
    minLength:6,
    maxLength:20,
    pattern: '^[0-9A-Za-z!"#$%&\'()*+,\\-./:;<=>?@[\\]\\\\^_{|}~]+$',
  })
  // @Trim()
  @IsString()
  @Length(6, 20)
  @Matches(/^[0-9A-Za-z!"#$%&'()*+,\-./:;<=>?@[\]\\^_{|}~]+$/, {
  message:
    'Allowed characters: 0-9, A-Z, a-z and special symbols ! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ { | } ~',
  })
  password : string;
};
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Matches, MaxLength, MinLength, IsNotEmpty, ValidationArguments, registerDecorator } from "class-validator";

export class ProfileInputDto {
	@ApiProperty({ description: "User name", example: "JohnDoe" })
	@MaxLength(30)
	@MinLength(6)
	@Matches(/^[a-zA-Z0-9_-]*$/, { message: "User name allows only letters, numbers, _ and -" })
	@IsString()
	@IsNotEmpty()
	userName: string;
	@ApiProperty({ description: "First name", example: "John" })
	@MinLength(1)
	@MaxLength(50)
	@IsString()
	@IsNotEmpty()
	firstName: string;
	@ApiProperty({ description: "Last name", example: "Doe" })
	@MinLength(1)
	@MaxLength(50)
	@IsString()
	@IsNotEmpty()
	lastName: string;
	@ApiProperty({ description: "City", example: "New York" })
	@MinLength(1)
	@MaxLength(50)
	@IsString()
	city: string;
	@ApiProperty({ description: "Country", example: "USA" })
	@MinLength(1)
	@MaxLength(50)
	@IsString()
	@IsOptional()
	country: string;
	@ApiProperty({ description: "Region", example: "NY" })
	@MinLength(1)
	@MaxLength(50)
	@IsString()
	@IsOptional()
	region: string;
	@ApiProperty({ description: "Date of birth", example: "2007-08-28" })
	@MinLength(1)
	@MaxLength(50)
	@IsOptional()
	@IsString()
	@(
		(() => (object: any, propertyName: string) => {
			registerDecorator({
				name: "isUnderAge13",
				target: object.constructor,
				propertyName: propertyName,
				options: { message: "A user under 13 cannot create a profile." },
				validator: {
					validate(value: any, _args: ValidationArguments) {
						const birthDate = new Date(value); // формат YYYY-MM-DD
						const today = new Date();

						// Дата 13 лет назад от сегодняшнего дня
						const thirteenYearsAgo = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());

						return birthDate <= thirteenYearsAgo;
					},
				},
			});
		})()
	)
	@(
		(() => (object: any, propertyName: string) => {
			registerDecorator({
				name: "isNotInFuture",
				target: object.constructor,
				propertyName: propertyName,
				options: { message: "Date of birth cannot be in the future." },
				validator: {
					validate(value: any, _args: ValidationArguments) {
						const birthDate = new Date(value); // формат YYYY-MM-DD
						const today = new Date();

						return birthDate <= today;
					},
				},
			});
		})()
	)
	dateOfBirth: Date;
	@ApiProperty({ description: "About me", example: "I am a software engineer" })
	@MinLength(0)
	@MaxLength(200)
	@IsString()
	@IsOptional()
	aboutMe: string;
}

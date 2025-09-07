import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Matches, MaxLength, MinLength, IsNotEmpty, ValidationArguments, registerDecorator, IsDate } from "class-validator";

export class ProfileInputDto {
	@ApiProperty({ description: "User name", example: "John Doe" })
	@MaxLength(30)
	@MinLength(6)
	@Matches(/^[a-zA-Z0-9_-]*$/)
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
	@ApiProperty({ description: "Date of birth", example: "2020-08-28T13:28:13.024Z" })
	@MinLength(1)
	@MaxLength(50)
	@IsDate()
	@IsOptional()
	@(
		(() => (object: any, propertyName: string) => {
			registerDecorator({
				name: "isUnderAge13",
				target: object.constructor,
				propertyName: propertyName,
				options: { message: "A user under 13 cannot create a profile." },
				validator: {
					validate(value: any, _args: ValidationArguments) {
						if (!(value instanceof Date)) return false;
						const today = new Date();
						const thirteenYearsAgo = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
						return value <= thirteenYearsAgo;
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

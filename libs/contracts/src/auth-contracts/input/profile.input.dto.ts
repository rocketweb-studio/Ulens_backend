import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Matches, MaxLength, MinLength, IsNotEmpty, registerDecorator } from "class-validator";

const isValidDate = (value: string): boolean => {
	const [day, month, year] = value.split(".").map(Number);
	const date = new Date(year, month - 1, day);
	return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

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
	@Matches(/^[A-Za-zА-Яа-яЁё]+$/, { message: "Allowed only russian and latin letters" })
	@IsNotEmpty()
	firstName: string;
	@ApiProperty({ description: "Last name", example: "Doe" })
	@MinLength(1)
	@MaxLength(50)
	@Matches(/^[A-Za-zА-Яа-яЁё]+$/, { message: "Allowed only russian and latin letters" })
	@IsString()
	@IsNotEmpty()
	lastName: string;
	@ApiProperty({ description: "City", example: "New York" })
	@MinLength(1)
	@MaxLength(50)
	@Matches(/^[A-Za-zА-Яа-яЁё]+$/, { message: "Allowed only russian and latin letters" })
	@IsString()
	city: string;
	@ApiProperty({ description: "Country", example: "USA" })
	@MinLength(1)
	@MaxLength(50)
	@Matches(/^[A-Za-zА-Яа-яЁё]+$/, { message: "Allowed only russian and latin letters" })
	@IsString()
	@IsOptional()
	country: string;
	@ApiProperty({ description: "Region", example: "NY" })
	@MinLength(1)
	@MaxLength(50)
	@Matches(/^[A-Za-zА-Яа-яЁё]+$/, { message: "Allowed only russian and latin letters" })
	@IsString()
	@IsOptional()
	region: string;
	@ApiProperty({ description: "Date of birth", example: "08.28.2007" })
	@MinLength(1)
	@MaxLength(50)
	@IsOptional()
	@IsString()
	@Matches(/^([0-2]\d|3[01])\.(0\d|1[0-2])\.(19|20)\d{2}$/, {
		message: "Date must be in format dd.mm.yyyy",
	})
	@(
		(() => (object: any, propertyName: string) => {
			registerDecorator({
				name: "isUnderAge13",
				target: object.constructor,
				propertyName: propertyName,
				options: { message: "User under 13 years old cannot create a profile." },
				validator: {
					validate(value: string) {
						// First check if the value matches the expected format
						const dateFormatRegex = /^([0-2]\d|3[01])\.(0\d|1[0-2])\.(19|20)\d{2}$/;
						if (!dateFormatRegex.test(value)) {
							return true; // Let @Matches handle format validation
						}

						if (!isValidDate(value)) return false;

						const [day, month, year] = value.split(".").map(Number);
						const birthDate = new Date(year, month - 1, day);
						const today = new Date();
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
					validate(value: string) {
						// First check if the value matches the expected format
						const dateFormatRegex = /^([0-2]\d|3[01])\.(0\d|1[0-2])\.(19|20)\d{2}$/;
						if (!dateFormatRegex.test(value)) {
							return true; // Let @Matches handle format validation
						}

						if (!isValidDate(value)) return false;
						const [day, month, year] = value.split(".").map(Number);
						const birthDate = new Date(year, month - 1, day);
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

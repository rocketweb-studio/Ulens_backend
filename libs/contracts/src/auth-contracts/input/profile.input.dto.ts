import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Matches, MaxLength, MinLength, IsNotEmpty, registerDecorator } from "class-validator";

// Проверка високосного года
const isLeapYear = (year: number): boolean => {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

// Проверка существования даты
const isValidDate = (value: string): boolean => {
	const [day, month, year] = value.split(".").map(Number);
	if (!day || !month || !year) return false;
	if (month < 1 || month > 12 || day < 1 || day > 31) return false;

	const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	return day <= daysInMonth[month - 1];
};

export class ProfileInputDto {
	@ApiProperty({ description: "User name", example: "JohnDoe" })
	@MaxLength(30)
	@MinLength(6)
	@Matches(/^[a-zA-Z0-9_-]*$/, {
		message: "User name allows only letters, numbers, _ and -",
	})
	@IsString()
	@IsNotEmpty()
	userName: string;

	@ApiProperty({ description: "First name", example: "John" })
	@MinLength(1)
	@MaxLength(50)
	@Matches(/^[A-Za-zА-Яа-яЁё]+$/, {
		message: "Allowed only russian and latin letters",
	})
	@IsString()
	@IsNotEmpty()
	firstName: string;

	@ApiProperty({ description: "Last name", example: "Doe" })
	@MinLength(1)
	@MaxLength(50)
	@Matches(/^[A-Za-zА-Яа-яЁё]+$/, {
		message: "Allowed only russian and latin letters",
	})
	@IsString()
	@IsNotEmpty()
	lastName: string;

	@ApiProperty({ description: "City", example: "New York" })
	@MinLength(1)
	@MaxLength(50)
	@Matches(/^[A-Za-zА-Яа-яЁё\s]+$/, {
		message: "Allowed only russian and latin letters",
	})
	@IsString()
	city: string;

	@ApiProperty({ description: "Country", example: "USA" })
	@MinLength(1)
	@MaxLength(50)
	@Matches(/^[A-Za-zА-Яа-яЁё\s]+$/, {
		message: "Allowed only russian and latin letters",
	})
	@IsString()
	@IsOptional()
	country: string;

	@ApiProperty({ description: "Region", example: "NY" })
	@MinLength(1)
	@MaxLength(50)
	@Matches(/^[A-Za-zА-Яа-яЁё\s]+$/, {
		message: "Allowed only russian and latin letters",
	})
	@IsString()
	@IsOptional()
	region: string;

	@ApiProperty({ description: "Date of birth", example: "28.08.2007" })
	@MinLength(10)
	@MaxLength(10)
	@IsOptional()
	@IsString()
	@Matches(/^([0-2]\d|3[01])\.(0\d|1[0-2])\.(19|20)\d{2}$/, {
		message: "Date must be in format dd.mm.yyyy",
	})
	@(
		(object: any, propertyName: string) => {
			registerDecorator({
				name: "isValidDate",
				target: object.constructor,
				propertyName,
				options: { message: "Date is invalid or does not exist (e.g. 31.02.2020)" },
				validator: {
					validate(value: string) {
						return isValidDate(value);
					},
				},
			});
		}
	)
	@(
		(object: any, propertyName: string) => {
			registerDecorator({
				name: "isUnderAge13",
				target: object.constructor,
				propertyName,
				options: { message: "User under 13 years old cannot create a profile." },
				validator: {
					validate(value: string) {
						if (!isValidDate(value)) return true;
						const [day, month, year] = value.split(".").map(Number);
						const birthDate = new Date(year, month - 1, day);
						const today = new Date();
						const thirteenYearsAgo = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
						return birthDate <= thirteenYearsAgo;
					},
				},
			});
		}
	)
	@(
		(object: any, propertyName: string) => {
			registerDecorator({
				name: "isNotInFuture",
				target: object.constructor,
				propertyName,
				options: { message: "Date of birth cannot be in the future." },
				validator: {
					validate(value: string) {
						if (!isValidDate(value)) return true;
						const [day, month, year] = value.split(".").map(Number);
						const birthDate = new Date(year, month - 1, day);
						const today = new Date();
						return birthDate <= today;
					},
				},
			});
		}
	)
	dateOfBirth: string;

	@ApiProperty({ description: "About me", example: "I am a software engineer" })
	@MinLength(0)
	@MaxLength(200)
	@IsString()
	@IsOptional()
	aboutMe: string;
}

import { ApiProperty } from "@nestjs/swagger";

enum PaymentIntervalEnum {
	MONTH = "month",
	WEEK = "week",
	DAY = "day",
	YEAR = "year",
}

enum CurrencyEnum {
	USD = "usd",
	EUR = "eur",
	BYN = "byn",
	RUB = "rub",
}

export class PlanOutputDto {
	@ApiProperty({ description: "Id of the plan", example: "123e4567-e89b-12d3-a456-426614174000" })
	id: string;
	@ApiProperty({ description: "Title of the plan", example: "Basic" })
	title: string;
	@ApiProperty({ description: "Description of the plan", example: "Basic plan" })
	description: string;
	@ApiProperty({ description: "Price of the plan", example: 100 })
	price: number;
	@ApiProperty({
		description: "Interval of the plan",
		example: "month",
		enum: PaymentIntervalEnum,
		enumName: "PaymentIntervalsEnum",
	})
	interval: PaymentIntervalEnum;
	@ApiProperty({
		description: "Currency of the plan",
		example: "usd",
		enum: CurrencyEnum,
		enumName: "CurrencyEnum",
	})
	currency: CurrencyEnum;
}

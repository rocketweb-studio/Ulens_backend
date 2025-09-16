import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsIn } from "class-validator";

export enum PaymentIntervalsEnum {
	MONTH = "month",
	WEEK = "week",
	DAY = "day",
	YEAR = "year",
}

export enum CurrencyEnum {
	USD = "usd",
	EUR = "eur",
	BYN = "byn",
	RUB = "rub",
}

const PaymentIntervalsArray = Object.values(PaymentIntervalsEnum);
const CurrencyArray = Object.values(CurrencyEnum);
export class PlanInputDto {
	@ApiProperty({ description: "Title of the plan", example: "Basic" })
	@IsString()
	@IsNotEmpty()
	title: string;
	@ApiProperty({ description: "Description of the plan", example: "Basic plan" })
	@IsString()
	@IsNotEmpty()
	description: string;
	@ApiProperty({ description: "Price of the plan", example: 100 })
	@IsNumber()
	@IsNotEmpty()
	price: number;
	@ApiProperty({
		description: "Interval of the plan",
		example: "month",
		enum: PaymentIntervalsEnum,
		enumName: "PaymentIntervalsEnum",
	})
	@IsIn(PaymentIntervalsArray)
	@IsString()
	@IsNotEmpty()
	interval: PaymentIntervalsEnum;
	@ApiProperty({
		description: "Currency of the plan",
		example: "usd",
		enum: CurrencyEnum,
		enumName: "CurrencyEnum",
	})
	@IsIn(CurrencyArray)
	@IsString()
	@IsNotEmpty()
	currency: CurrencyEnum;
}

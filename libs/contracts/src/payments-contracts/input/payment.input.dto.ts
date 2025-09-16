import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsString } from "class-validator";

export enum PaymentProvidersEnum {
	STRIPE = "STRIPE",
	PAYPAL = "PAYPAL",
}
const PaymentProvidersArray = Object.values(PaymentProvidersEnum);

export class PaymentInputDto {
	@ApiProperty({ description: "Plan id", example: "5ab7f8c2-16f9-4dd5-9d52-49ecaed18b38" })
	@IsString()
	@IsNotEmpty()
	planId: string;
	@ApiProperty({
		description: "Payment provider",
		example: "STRIPE",
		enum: PaymentProvidersEnum,
		enumName: "PaymentProvidersEnum",
	})
	@IsString()
	@IsIn(PaymentProvidersArray)
	@IsNotEmpty()
	provider: PaymentProvidersEnum;
}

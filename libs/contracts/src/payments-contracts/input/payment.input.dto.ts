import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { PaymentProvidersEnum } from "@libs/contracts/payments-contracts/payment-constants";

const PaymentProvidersArray = Object.values(PaymentProvidersEnum);

export class PaymentInputDto {
	@ApiProperty({ description: "Plan id", example: 1 })
	@IsNumber()
	@IsNotEmpty()
	planId: number;
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

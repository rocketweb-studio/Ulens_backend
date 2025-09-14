import { ApiProperty } from "@nestjs/swagger";
import { PaymentProvidersEnum } from "../input/payment.input.dto";

export class TransactionOutputDto {
	@ApiProperty({ description: "Id of the transaction", example: "123e4567-e89b-12d3-a456-426614174000" })
	id: string;
	@ApiProperty({ description: "Amount of the transaction", example: 100 })
	amount: number;
	@ApiProperty({ description: "Currency of the transaction", example: "USD" })
	currency: string;
	@ApiProperty({ description: "Status of the transaction", example: "PENDING" })
	status: string;
	@ApiProperty({ description: "Created at of the transaction", example: "2021-01-01T00:00:00.000Z" })
	createdAt: Date;
	@ApiProperty({ description: "User id of the transaction", example: "123e4567-e89b-12d3-a456-426614174000" })
	userId: string;
	@ApiProperty({ description: "Provider of the transaction", example: PaymentProvidersEnum.STRIPE })
	provider: PaymentProvidersEnum;
	@ApiProperty({ description: "Expires at of the transaction", example: "2021-01-01T00:00:00.000Z" })
	expiresAt: Date;
}

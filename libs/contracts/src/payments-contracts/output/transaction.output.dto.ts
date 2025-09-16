import { ApiProperty } from "@nestjs/swagger";

enum CurrencyEnum {
	USD = "usd",
	EUR = "eur",
	BYN = "byn",
	RUB = "rub",
}

enum TransactionStatusEnum {
	PENDING = "PENDING",
	SUCCESS = "SUCCESS",
	FAILED = "FAILED",
	EXPIRED = "EXPIRED",
}

enum TransactionProviderEnum {
	STRIPE = "STRIPE",
	PAYPAL = "PAYPAL",
}

export class TransactionOutputDto {
	@ApiProperty({ description: "Id of the transaction", example: "123e4567-e89b-12d3-a456-426614174000" })
	id: string;
	@ApiProperty({ description: "Amount of the transaction", example: 100 })
	amount: number;
	@ApiProperty({
		description: "Currency of the transaction",
		example: "usd",
		enum: CurrencyEnum,
		enumName: "CurrencyEnum",
	})
	currency: CurrencyEnum;
	@ApiProperty({
		description: "Status of the transaction",
		example: "PENDING",
		enum: TransactionStatusEnum,
		enumName: "TransactionStatusEnum",
	})
	status: TransactionStatusEnum;
	@ApiProperty({ description: "Created at of the transaction", example: "2021-01-01T00:00:00.000Z" })
	createdAt: Date;
	@ApiProperty({ description: "User id of the transaction", example: "123e4567-e89b-12d3-a456-426614174000" })
	userId: string;
	@ApiProperty({
		description: "Provider of the transaction",
		example: TransactionProviderEnum.STRIPE,
		enum: TransactionProviderEnum,
		enumName: "TransactionProviderEnum",
	})
	provider: TransactionProviderEnum;
	@ApiProperty({ description: "Expires at of the transaction", example: "2021-01-01T00:00:00.000Z" })
	expiresAt: Date;
}

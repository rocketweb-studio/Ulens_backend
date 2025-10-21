import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TransactionModel {
	@Field(() => Number)
	id: number;

	@Field(() => Number)
	amount: number;

	@Field(() => String)
	currency: string;

	@Field(() => String)
	status: string;

	@Field(() => String)
	provider: string;

	@Field(() => String)
	expiresAt: string;

	@Field(() => String)
	interval: string;
}

@ObjectType()
export class TransactionsResponse {
	@Field(() => Number)
	totalCount: number;

	@Field(() => Number)
	page: number;

	@Field(() => Number)
	pageSize: number;

	@Field(() => [TransactionModel])
	items: TransactionModel[];
}

// export class TransactionOutputDto {
// 	@ApiProperty({ description: "Id of the transaction", example: 1 })
// 	id: number;
// 	@ApiProperty({ description: "Amount of the transaction", example: 100 })
// 	amount: number;
// 	@ApiProperty({
// 		description: "Currency of the transaction",
// 		example: "usd",
// 		enum: CurrencyEnum,
// 		enumName: "CurrencyEnum",
// 	})
// 	currency: CurrencyEnum;
// 	@ApiProperty({
// 		description: "Status of the transaction",
// 		example: "PENDING",
// 		enum: TransactionStatusEnum,
// 		enumName: "TransactionStatusEnum",
// 	})
// 	status: TransactionStatusEnum;
// 	@ApiProperty({ description: "Created at of the transaction", example: "2021-01-01T00:00:00.000Z" })
// 	createdAt: Date;
// 	@ApiProperty({ description: "User id of the transaction", example: "123e4567-e89b-12d3-a456-426614174000" })
// 	userId: string;
// 	@ApiProperty({
// 		description: "Provider of the transaction",
// 		example: PaymentProvidersEnum.STRIPE,
// 		enum: PaymentProvidersEnum,
// 		enumName: "TransactionProviderEnum",
// 	})
// 	provider: PaymentProvidersEnum;
// 	@ApiProperty({ description: "Expires at of the transaction", example: "2021-01-01T00:00:00.000Z" })
// 	expiresAt: Date;

// 	@ApiProperty({ description: "Interval of the transaction", example: "month" })
// 	interval: PaymentIntervalEnum;
// }

// export class TransactionWithPageInfoOutputDto {
// 	@ApiProperty({ description: "Total count of the transactions", example: 100 })
// 	totalCount: number;
// 	@ApiProperty({ description: "Page size of the transactions", example: 10 })
// 	pageSize: number;
// 	@ApiProperty({ description: "Page number of the transactions", example: 1 })
// 	page: number;
// 	@ApiProperty({ description: "Items of the transactions", type: [TransactionOutputDto] })
// 	items: TransactionOutputDto[];
// }

import { ApiProperty } from "@nestjs/swagger";

export class SubscriptionOutputDto {
	@ApiProperty({ description: "Id of the subscription", example: 1 })
	id: number;
	@ApiProperty({ description: "Created at of the subscription", example: "2021-01-01T00:00:00.000Z" })
	createdAt: Date;
	@ApiProperty({ description: "Expires at of the subscription", example: "2021-01-01T00:00:00.000Z" })
	expiresAt: Date;
	@ApiProperty({ description: "Is auto renewal of the subscription", example: true })
	isAutoRenewal: boolean;
}

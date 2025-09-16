import { ApiProperty } from "@nestjs/swagger";

export class SubscriptionOutputDto {
	@ApiProperty({ description: "Id of the subscription", example: "123e4567-e89b-12d3-a456-426614174000" })
	id: string;
	@ApiProperty({ description: "Created at of the subscription", example: "2021-01-01T00:00:00.000Z" })
	createdAt: Date;
	@ApiProperty({ description: "Expires at of the subscription", example: "2021-01-01T00:00:00.000Z" })
	expiresAt: Date;
	@ApiProperty({ description: "Is auto renewal of the subscription", example: true })
	isAutoRenewal: boolean;
}

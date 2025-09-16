import { ApiProperty } from "@nestjs/swagger";

export class PaymentOutputDto {
	@ApiProperty({ description: "URL for redirect to payment page", example: "https://example.com/payment" })
	url: string;
}

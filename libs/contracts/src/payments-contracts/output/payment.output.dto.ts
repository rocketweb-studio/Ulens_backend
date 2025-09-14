import { ApiProperty } from "@nestjs/swagger";

export class PaymentOutputDto {
	@ApiProperty({ description: "URL for payment page", example: "https://example.com/payment" })
	url: string;
}

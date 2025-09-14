import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class RenewalInputDto {
	@ApiProperty({ description: "Is auto renewal", example: true })
	@IsBoolean()
	@IsNotEmpty()
	isAutoRenewal: boolean;
}

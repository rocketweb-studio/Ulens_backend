import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ReadNotificationInputDto {
	@ApiProperty({ description: "Notification id", example: "1" })
	@IsNumber()
	@IsNotEmpty()
	notificationId: number;
}

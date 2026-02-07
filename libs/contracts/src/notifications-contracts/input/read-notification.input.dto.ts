import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class ReadNotificationInputDto {
	@ApiProperty({ description: "Notification id", example: [1, 2, 3] })
	@IsArray()
	@IsNumber({}, { each: true, message: "Each notification id must be a number" })
	@IsNotEmpty({ message: "Notification ids are required" })
	@IsPositive({ each: true, message: "Each notification id must be a positive number" })
	notificationIds: number[];
}

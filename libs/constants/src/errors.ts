import { HttpStatuses } from "./http-statuses";
import { ApiProperty } from "@nestjs/swagger";

export class DefaultErrorResponse {
	@ApiProperty({ description: "Status code", example: 404 })
	statusCode: HttpStatuses;
	@ApiProperty({ description: "Timestamp", example: "2021-01-01T00:00:00.000Z" })
	timestamp: string;
	@ApiProperty({ description: "Path", example: "/api/v1/endpoint" })
	path: string;
	@ApiProperty({ description: "Message", example: "Not Found" })
	message: string;
}

import { DefaultErrorResponse } from "@libs/constants/index";
import { RoomOutputDto } from "@libs/contracts/index";
import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";

/**
 * @swagger
 * @response 200 - Ok
 * @response 401 - Unauthorized
 */
export const GetRoomsSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Get rooms" }),
		ApiOkResponse({ description: "Rooms were successfully received", type: [RoomOutputDto] }),
		ApiNotFoundResponse({ description: "Rooms not found", type: DefaultErrorResponse }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
		ApiBearerAuth(),
	];

	return applyDecorators(...decorators);
};

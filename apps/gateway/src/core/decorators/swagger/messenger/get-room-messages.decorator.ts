import { DefaultErrorResponse } from "@libs/constants/index";
import { MessageOutputDto } from "@libs/contracts/index";
import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";

/**
 * @swagger
 * @response 200 - Ok
 * @response 401 - Unauthorized
 */
export const GetRoomMessagesSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Get room messages history" }),
		ApiOkResponse({ description: "Room messages were successfully received", type: [MessageOutputDto] }),
		ApiNotFoundResponse({ description: "Room messages not found", type: DefaultErrorResponse }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
		ApiBearerAuth(),
	];

	return applyDecorators(...decorators);
};

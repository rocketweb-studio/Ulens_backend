import { DefaultErrorResponse } from "@libs/constants/index";
import { RoomOutputDto } from "@libs/contracts/index";
import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiUnauthorizedResponse, OmitType } from "@nestjs/swagger";

/**
 * @swagger
 * @response 201 - Created
 * @response 401 - Unauthorized
 */
export const CreateRoomSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Create room" }),
		ApiCreatedResponse({ description: "Room was successfully created", type: OmitType(RoomOutputDto, ["lastMessage", "roomUser"] as const) }),
		ApiNotFoundResponse({ description: "Room not found", type: DefaultErrorResponse }),
		ApiUnauthorizedResponse({ description: "Unauthorized" }),
		ApiBearerAuth(),
	];

	return applyDecorators(...decorators);
};

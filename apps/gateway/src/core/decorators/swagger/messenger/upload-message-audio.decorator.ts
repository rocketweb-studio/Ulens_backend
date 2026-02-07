import { MessageAudioOutputDto } from "@libs/contracts/index";
import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";

/**
 * @swagger
 * @response 200 - Ok
 * @response 401 - Unauthorized
 */
export const UploadMessageAudioSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Upload message audio" }),
		ApiConsumes("multipart/form-data"),
		ApiBody({
			schema: {
				type: "object",
				properties: {
					audio: {
						type: "string",
						format: "binary",
						description: "Message audio file (MP3, WAV) max size 20MB",
					},
				},
				required: ["audio"],
			},
		}),
		ApiCreatedResponse({
			description: "Message audio uploaded successfully",
			type: MessageAudioOutputDto,
		}),
		ApiResponse({
			status: 400,
			description: "If the audio is not uploaded or has an unsupported type or max size is exceeded",
		}),
		ApiUnauthorizedResponse({
			description: "Unauthorized",
		}),
	];

	return applyDecorators(...decorators);
};

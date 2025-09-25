import { AvatarImagesOutputDto } from "@libs/contracts/index";
import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";

/**
 * @swagger
 * @response 201 - Avatar uploaded successfully
 * @response 400 - Bad request
 * @response 401 - Unauthorized
 */
export const UploadAvatarSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Upload avatar" }),
		ApiBearerAuth(),
		ApiConsumes("multipart/form-data"),
		ApiBody({
			schema: {
				type: "object",
				properties: {
					avatar: {
						type: "string",
						format: "binary",
						description: "Avatar image file (JPEG, PNG) max size 10MB",
					},
				},
				required: ["avatar"],
			},
		}),
		ApiCreatedResponse({
			description: "Avatar uploaded successfully",
			type: AvatarImagesOutputDto,
		}),
		ApiResponse({
			status: 400,
			description: "If the avatar is not uploaded or has an unsupported type or max size is exceeded",
		}),
		ApiUnauthorizedResponse({
			description: "Unauthorized",
		}),
	];

	return applyDecorators(...decorators);
};

import { UploadImageOutputDto } from "@libs/contracts/index";
import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";

/**
 * @swagger
 * @response 200 - Ok
 * @response 401 - Unauthorized
 */
export const UploadMessageImagesSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Upload message images" }),
		ApiConsumes("multipart/form-data"),
		ApiBody({
			schema: {
				type: "object",
				properties: {
					images: {
						type: "string",
						format: "binary",
						description: "Message images file (JPEG, PNG) max size 20MB",
					},
				},
				required: ["images"],
			},
		}),
		ApiCreatedResponse({
			description: "Message images uploaded successfully",
			type: UploadImageOutputDto,
		}),
		ApiResponse({
			status: 400,
			description: "If the images are not uploaded or has an unsupported type or max size is exceeded",
		}),
		ApiUnauthorizedResponse({
			description: "Unauthorized",
		}),
	];

	return applyDecorators(...decorators);
};

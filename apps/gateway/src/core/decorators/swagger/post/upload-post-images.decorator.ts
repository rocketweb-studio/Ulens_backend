import { ImageOutputDto } from "@libs/contracts/index";
import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiParam, ApiResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";

/**
 * @swagger
 * @response 201 - Avatar uploaded successfully
 * @response 400 - Bad request
 * @response 401 - Unauthorized
 */
export const UploadPostImagesSwagger = () => {
	const decorators = [
		ApiOperation({ summary: "Upload post images" }),
		ApiBearerAuth(),
		ApiConsumes("multipart/form-data"),
		ApiParam({
			name: "postId",
			type: "string",
			description: "Post ID",
		}),
		ApiBody({
			schema: {
				type: "object",
				properties: {
					images: {
						type: "string",
						format: "binary",
						description: "Post images file (JPEG, PNG) max size 20MB",
					},
				},
				required: ["images"],
			},
		}),
		ApiCreatedResponse({
			description: "Post images uploaded successfully",
			type: [ImageOutputDto],
		}),
		ApiResponse({
			status: 400,
			description: "If the images are not uploaded or has an unsupported type or max size is exceeded",
		}),
		ApiUnauthorizedResponse({
			description: "If the user is not authorized",
		}),
	];

	return applyDecorators(...decorators);
};

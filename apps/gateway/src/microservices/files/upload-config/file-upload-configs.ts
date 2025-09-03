import { FileUploadOptionsDto } from "@gateway/dto/file-upload-options.dto";

export class FileUploadConfigs {
	static readonly AVATAR: FileUploadOptionsDto = {
		fieldName: "avatar",
		folder: "avatars",
		maxFiles: 1,
		allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
		maxSize: 10 * 1024 * 1024, // 10MB
	};

	static readonly POST_IMAGES: FileUploadOptionsDto = {
		fieldName: "images",
		folder: "posts",
		maxFiles: 10,
		allowedTypes: ["image/jpeg", "image/png"],
		maxSize: 5 * 1024 * 1024, // 20MB
	};
}

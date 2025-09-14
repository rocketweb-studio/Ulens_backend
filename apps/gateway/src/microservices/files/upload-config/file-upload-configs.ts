export class FileUploadOptionsDto {
	fieldName: string; // Имя поля в form-data (avatar, images, etc.)
	folder: string; // Папка для сохранения в s3
	maxFiles: number; // Максимальное количество файлов (по умолчанию 1)
	allowedTypes: string[]; // Разрешенные MIME типы
	maxSize: number; // Максимальный размер файла в байтах
	fileSizes: string[]; // Размеры файлов
}

export class FileUploadConfigs {
	static readonly AVATAR: FileUploadOptionsDto = {
		fieldName: "avatar",
		folder: "avatars",
		maxFiles: 1,
		allowedTypes: ["image/jpeg", "image/png"],
		maxSize: 10 * 1024 * 1024, // 10MB
		fileSizes: ["192x192", "45x45"],
	};

	static readonly POST_IMAGES: FileUploadOptionsDto = {
		fieldName: "images",
		folder: "posts",
		maxFiles: 10,
		allowedTypes: ["image/jpeg", "image/png"],
		maxSize: 5 * 1024 * 1024, // 20MB
		fileSizes: ["192x192", "512x512"],
	};
}

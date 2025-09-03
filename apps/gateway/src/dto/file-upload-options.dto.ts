export class FileUploadOptionsDto {
	fieldName: string; // Имя поля в form-data (avatar, images, etc.)
	folder: string; // Папка для сохранения в s3
	maxFiles: number; // Максимальное количество файлов (по умолчанию 1)
	allowedTypes: string[]; // Разрешенные MIME типы
	maxSize: number; // Максимальный размер файла в байтах
}

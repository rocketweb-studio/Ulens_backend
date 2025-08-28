import { StorageService } from "@files/core/storage/storage.service";
import { Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("files")
export class FilesController {
	constructor(private readonly storageService: StorageService) {}

	@Post("upload")
	@HttpCode(HttpStatus.CREATED)
	@UseInterceptors(FileInterceptor("file")) // 'file' — это имя поля в форме
	async uploadFile(@UploadedFile() file: any): Promise<any> {
		console.log("Uploaded file:", file);
		const buffer = file.buffer;
		const filename = `avatars/${file.originalname}`;
		const mimeType = file.mimetype;

		await this.storageService.uploadFile(buffer, filename, mimeType);

		// await this.storageService.uploadFile(buffer, filename, mimeType);
		return { message: "File uploaded successfully", filename: file.originalname };
	}
}

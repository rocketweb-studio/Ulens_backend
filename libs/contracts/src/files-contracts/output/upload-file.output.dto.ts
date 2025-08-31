export class UploadFileOutputDto {
	readonly success: boolean;
	readonly filename: string;
	readonly fileSize: number;
	readonly message: string;
}

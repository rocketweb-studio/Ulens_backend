export class UploadFileOutputDto {
	readonly success: boolean;
	readonly versions: {
		url: string;
		width: number;
		height: number;
		fileSize: number;
		size: string;
	}[];
}

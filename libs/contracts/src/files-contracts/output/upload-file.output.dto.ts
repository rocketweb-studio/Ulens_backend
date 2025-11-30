export class UploadImageOutputDto {
	readonly success: boolean;
	readonly versions: {
		url: string;
		width: number;
		height: number;
		fileSize: number;
		size: string;
	}[];
}

export class UploadAudioOutputDto {
	readonly success: boolean;
	readonly versions: {
		url: string;
	}[];
}

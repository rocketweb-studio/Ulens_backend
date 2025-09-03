export class AvatarInputDto {
	readonly userId: string;
	readonly versions: {
		url: string;
		width: number;
		height: number;
		fileSize: number;
	}[];
}

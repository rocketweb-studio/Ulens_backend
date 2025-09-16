import { FilesSizes } from "@libs/constants/index";

export class AvatarInputDto {
	readonly userId: string;
	readonly versions: {
		url: string;
		width: number;
		height: number;
		fileSize: number;
		size: FilesSizes;
	}[];
}

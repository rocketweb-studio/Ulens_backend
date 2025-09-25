type Size = "small" | "medium" | "large";

export class PostImagesOutputForMapDto {
	url: string;
	width: number;
	height: number;
	fileSize: number;
	createdAt: Date;
	id: string;
	parentId: string;
	size: Size;
}

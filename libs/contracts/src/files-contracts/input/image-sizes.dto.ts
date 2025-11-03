enum FilesSizes {
	SMALL = "small",
	MEDIUM = "medium",
	LARGE = "large",
}

export class ImageSizesDto {
	type: FilesSizes;
	width: string;
}

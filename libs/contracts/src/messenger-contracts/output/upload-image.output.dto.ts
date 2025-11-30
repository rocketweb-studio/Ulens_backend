import { MessageImgDto } from "@libs/contracts/files-contracts/output/message-img.output.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UploadImageOutputDto {
	@ApiProperty({
		description: "Upload image output",
		type: [MessageImgDto],
	})
	readonly files: MessageImgDto[];
}

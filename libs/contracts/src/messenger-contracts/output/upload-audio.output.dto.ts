import { MessageAudioOutputDto } from "@libs/contracts/files-contracts/output/messsage-audio.output.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UploadAudioOutputDto {
	@ApiProperty({
		description: "Upload audio output",
		type: MessageAudioOutputDto,
	})
	readonly file: MessageAudioOutputDto;
}

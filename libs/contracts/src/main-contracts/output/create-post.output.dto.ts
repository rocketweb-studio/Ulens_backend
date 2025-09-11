import { ApiProperty } from "@nestjs/swagger";

export class CreatePostOutputDto {
	@ApiProperty({ example: "5ab7f8c2-16f9-4dd5-9d52-49ecaed18b38" })
	id: string;
}

import { ApiProperty } from "@nestjs/swagger";

export class UsersCountOutputDto {
	@ApiProperty({ example: 10 })
	count: number;
}

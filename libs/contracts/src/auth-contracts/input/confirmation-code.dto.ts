import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, Length } from "class-validator";

export class ConfirmCodeDto {
    @ApiProperty({
        pattern: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    })
    @IsString()
    @Matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    code: string
}

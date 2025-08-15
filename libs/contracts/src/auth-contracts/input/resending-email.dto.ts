import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail } from "class-validator";

export class ResendEmailDto {
    @ApiProperty({
        pattern: '^[^\s@]+@[^\s@]+\.[^\s@]+$'
    })
    @IsEmail()
    @IsString()
    email: string
}

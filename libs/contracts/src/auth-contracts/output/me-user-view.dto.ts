import { ApiProperty } from "@nestjs/swagger";

export class MeUserViewDto {
	@ApiProperty({ description: "User ID", example: "123e4567-e89b-12d3-a456-426614174000" })
	userId: string;

	@ApiProperty({ description: "User name", example: "John Doe" })
	userName: string;

	@ApiProperty({ description: "User email", example: "john.doe@example.com" })
	email: string;

	static mapToView(model: any): MeUserViewDto {
		return {
			userId: model.id,
			userName: model.profile.userName,
			email: model.email,
		};
	}
}

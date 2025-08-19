import { UUID } from "crypto";

export class PayloadForJwtDto {
	userId: UUID;
	deviceId: UUID;
}

export class LoginOutputDto {
	refreshToken: string;
	payloadForJwt: PayloadForJwtDto;
}

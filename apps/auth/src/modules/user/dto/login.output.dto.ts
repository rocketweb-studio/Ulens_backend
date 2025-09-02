export class PayloadForJwtDto {
	userId: string;
	deviceId: string;
}

export class LoginOutputDto {
	refreshToken: string;
	payloadForJwt: PayloadForJwtDto;
}

export class RefreshOutputDto extends LoginOutputDto {}

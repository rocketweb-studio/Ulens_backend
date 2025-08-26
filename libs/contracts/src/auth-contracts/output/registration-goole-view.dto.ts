export class RegistrationGoogleOutputDto {
	id: string;
	userName: string;
	existedUser: boolean;
	refreshToken: string;
	payloadForJwt: PayloadForJwtDto;
}

export class PayloadForJwtDto {
	userId: string;
	deviceId: string;
}

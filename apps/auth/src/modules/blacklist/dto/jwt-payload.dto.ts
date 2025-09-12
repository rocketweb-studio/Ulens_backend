export class JwtPayloadDto {
	userId: string;
	deviceId: string;
	iat: number;
	exp: number;
}

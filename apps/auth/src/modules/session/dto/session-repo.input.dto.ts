export class SessionInputRepoDto {
	deviceId: string;
	userId: string;
	deviceName: string;
	iat: Date;
	exp: Date;
	ip: string;
	country?: string;
	city?: string;
	latitude?: number;
	longitude?: number;
	timezone: string;
	browser: string;
	os: string;
	type: string;
	userAgent: string;
}

import { ApiProperty } from "@nestjs/swagger";

export class SessionDto {
	@ApiProperty({ description: "Device ID", example: "123e4567-e89b-12d3-a456-426614174000" })
	deviceId: string;
	deviceName: string;
	@ApiProperty({ description: "IP", example: "127.0.0.1" })
	ip: string;
	@ApiProperty({ description: "Country", example: "USA" })
	country: string | null;
	@ApiProperty({ description: "City", example: "New York" })
	city: string | null;
	@ApiProperty({ description: "Latitude", example: 40.7128 })
	latitude: number | null;
	@ApiProperty({ description: "Longitude", example: -74.006 })
	longitude: number | null;
	@ApiProperty({ description: "Timezone", example: "UTC" })
	timezone: string | null;
	@ApiProperty({ description: "Browser", example: "Chrome" })
	browser: string | null;
	@ApiProperty({ description: "OS", example: "Windows" })
	os: string | null;
	@ApiProperty({ description: "Type", example: "Desktop" })
	type: string | null;
	@ApiProperty({ description: "Created at", example: "2021-01-01T00:00:00.000Z" })
	createdAt: Date;
}

export class SessionOutputDto {
	@ApiProperty({ type: SessionDto })
	currentSession: SessionDto;
	@ApiProperty({ type: [SessionDto] })
	otherSessions: SessionDto[];
}

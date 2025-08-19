class LocationDto {
	country: string;
	city: string;
	latitude: number;
	longitude: number;
	timezone: string;
}

class DeviceDto {
	browser: string;
	os: string;
	type: string;
	ip: string;
	userAgent: string;
}

export class SessionMetadataDto {
	location: LocationDto;
	device: DeviceDto;
}

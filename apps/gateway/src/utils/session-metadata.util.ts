import { Request } from "express";
import { lookup } from "geoip-lite";
// eslint-disable-next-line @typescript-eslint/no-require-imports
import DeviceDetector = require("device-detector-js");
import { SessionMetadataDto } from "@libs/contracts/index";

export function getSessionMetadata(
	req: Request,
	userAgent: string = "Unknown",
): SessionMetadataDto {
	const devIp = "127.0.0.1";
	const ip = req.ip || devIp;

	const location = lookup(ip);

	const device = new DeviceDetector().parse(userAgent);

	return {
		location: {
			country: location?.country || "Unknown",
			city: location?.city || "Unknown",
			latitude: location?.ll[0] || 0,
			longitude: location?.ll[1] || 0,
			timezone: location?.timezone || "Unknown",
		},
		device: {
			browser: device?.client?.name || "Unknown",
			os: device?.os?.name || "Unknown",
			type: device?.device?.type || "Unknown",
			ip,
			userAgent,
		},
	};
}

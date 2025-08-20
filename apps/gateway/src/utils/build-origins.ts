export function buildOrigins(allowedOrigins: string): string[] {
	const origins = allowedOrigins.split(",");
	return origins.map((origin) => origin.trim());
}

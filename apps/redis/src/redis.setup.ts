import { INestApplication } from "@nestjs/common";

function buildOrigins(allowedOrigins: string): string[] {
	const origins = allowedOrigins.split(",");
	return origins.map((origin) => origin.trim());
}

export function configApp(app: INestApplication) {
	app.enableCors({
		origin: buildOrigins(process.env.ALLOWED_ORIGINS as string),
	});
}

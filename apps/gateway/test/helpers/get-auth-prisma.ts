import { PrismaClient } from "../../../auth/src/core/prisma/generated";

/**
 * Функция служит для получения prismaClient и прямого обращения к БД Auth микросервиса во время выполнения тестов
 */
export function getAuthPrisma() {
	if (!process.env.AUTH_POSTGRES_URL) {
		throw new Error("AUTH_POSTGRES_URL is not set in process.env");
	}
	return new PrismaClient();
}

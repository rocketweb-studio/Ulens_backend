// apps/gateway/test/helpers/clear-db.ts
import { getPrismaClient } from "./get-prisma";

// порядок может быть важен
export async function clearAuthDb() {
	const prisma = getPrismaClient("auth");
	await prisma.$connect();
	try {
		await prisma.session.deleteMany();
		await prisma.tokensBlacklist.deleteMany();
		await prisma.profile.deleteMany();
		await prisma.user.deleteMany();
	} finally {
		await prisma.$disconnect();
	}
}

export async function clearMainDb() {
	const prisma = getPrismaClient("main");
	await prisma.$connect();
	try {
		await prisma.post.deleteMany();
	} finally {
		await prisma.$disconnect();
	}
}

export async function clearFilesDb() {
	const prisma = getPrismaClient("files");
	await prisma.$connect();
	try {
		await prisma.avatar.deleteMany();
		await prisma.post.deleteMany();
	} finally {
		await prisma.$disconnect();
	}
}

/**
 * Универсальный вызов для удобства.
 */
export async function clearAllDbs() {
	await Promise.all([clearAuthDb(), clearMainDb(), clearFilesDb()]);
}

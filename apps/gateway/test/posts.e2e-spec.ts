import { ImageOutputDto } from "@libs/contracts/index";
import { AuthTestManager } from "./helpers/auth-test-manager";
import { getPrismaClient } from "./helpers/get-prisma";
import { initSettings } from "./helpers/init-settings";
import { PostsTestManager } from "./helpers/posts-test-manager";
import { clearAuthDb, clearMainDb, clearFilesDb } from "./helpers/clear-db";

import { randomUUID } from "crypto";

describe("PostsController (upload images)", () => {
	let postsTestManager: PostsTestManager;
	let authTestManager: AuthTestManager;

	let prismaAuth: ReturnType<typeof getPrismaClient>;
	let prismaMain: ReturnType<typeof getPrismaClient>;
	let prismaFiles: ReturnType<typeof getPrismaClient>;

	// общие тестовые данные
	const email = `user_${Date.now()}@test.dev`;
	const password = "Pass123456";
	const userName = "Joseph";
	let accessToken = ""; // сюда сохраним токен один раз
	const tinyPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAA" + "AAC0lEQVR42mP8/x8AAwMCAO6l2mUAAAAASUVORK5CYII=", "base64");

	beforeAll(async () => {
		const result = await initSettings();
		postsTestManager = result.postsTestManger;
		authTestManager = result.authTestManger;

		prismaAuth = getPrismaClient("auth");
		prismaMain = getPrismaClient("main");
		prismaFiles = getPrismaClient("files");

		// регистрация + подтверждение
		await authTestManager.registration({ userName, email, password }, 204);
		const user = await prismaAuth.user.findUnique({ where: { email } });
		const code = user?.confirmationCode ?? "";
		await authTestManager.registrationConfirmation(code, 204);

		// логин и сохранение accessToken
		const loginRes = await authTestManager.login<{ accessToken: string }>({ email, password }, 200);
		accessToken = loginRes.accessToken;
	});

	afterAll(async () => {
		await clearAuthDb();
		await clearMainDb();
		await clearFilesDb();

		await prismaAuth.$disconnect();
		await prismaFiles.$disconnect();
	});

	it("- POST unauthorized upload -> 401", async () => {
		const postId = randomUUID();
		// валидная tiny PNG (1x1, прозрачная), чтобы не ломать sharp

		await postsTestManager.uploadImages(postId, [tinyPng], 401);
	});

	it("+ POST authorized upload 1 file -> 201", async () => {
		const postId = randomUUID();

		const body = await postsTestManager.uploadImages<ImageOutputDto[]>(postId, [tinyPng], 201, accessToken);

		expect(Array.isArray(body)).toBe(true);
		// сервис генерит 2 версии (192 и 512) из одного файла
		expect(body.length).toBe(2);

		const widths = body.map((x) => x.width).sort((a, b) => a - b);
		expect(widths).toEqual([192, 512]);

		for (const img of body) {
			expect(typeof img.url).toBe("string");
			expect(typeof img.height).toBe("number");
			expect(typeof img.fileSize).toBe("number");
			expect(typeof img.uploadId).toBe("string");
			expect(new Date(img.createdAt).toString()).not.toBe("Invalid Date");
		}
	});
});

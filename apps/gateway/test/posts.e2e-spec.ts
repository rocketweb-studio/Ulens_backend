import { ImageOutputDto } from "@libs/contracts/index";
import { AuthTestManager } from "./helpers/auth-test-manager";
import { getPrismaClient } from "./helpers/get-prisma";
import { initSettings } from "./helpers/init-settings";
import { PostsTestManager } from "./helpers/posts-test-manager";
import { clearDbs } from "./helpers/clear-db";
import { randomUUID } from "crypto";

describe("PostsController (upload images)", () => {
	let postsTestManager: PostsTestManager;
	let authTestManager: AuthTestManager;

	let prismaAuth: any;
	let prismaMain: any;
	let prismaFiles: any;

	// общие тестовые данные
	const email = `user_${Date.now()}@test.dev`;
	const password = "Pass123456";
	const userName = "Joseph";
	let accessToken = ""; // сюда сохраняем токен
	let otherAccessToken = "";
	const tinyPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAA" + "AAC0lEQVR42mP8/x8AAwMCAO6l2mUAAAAASUVORK5CYII=", "base64");
	let createdPostId = "";
	let userId = "";

	beforeAll(async () => {
		const result = await initSettings();
		postsTestManager = result.postsTestManger;
		authTestManager = result.authTestManger;

		prismaAuth = getPrismaClient("auth");
		prismaMain = getPrismaClient("main");
		prismaFiles = getPrismaClient("files");

		await Promise.all([prismaAuth.$connect(), prismaMain.$connect(), prismaFiles.$connect()]);

		// регистрация + подтверждение
		await authTestManager.registration({ userName, email, password }, 204);
		const user = await prismaAuth.user.findUnique({ where: { email } });
		userId = user?.id ?? "";
		const code = user?.confirmationCode ?? "";
		await authTestManager.registrationConfirmation(code, 204);

		// второй пользователь для кейсов 403
		{
			const otherEmail = `user2_${Date.now()}@test.dev`;
			const otherPassword = "Pass123456";
			const otherUserName = "MichaelJordan"; // валидно (>= 6)

			await authTestManager.registration({ userName: otherUserName, email: otherEmail, password: otherPassword }, 204);
			const otherUser = await prismaAuth.user.findUnique({ where: { email: otherEmail } });
			const otherCode = otherUser?.confirmationCode ?? "";
			await authTestManager.registrationConfirmation(otherCode, 204);

			const otherLogin = await authTestManager.login<{ accessToken: string }>({ email: otherEmail, password: otherPassword }, 200);
			otherAccessToken = otherLogin.accessToken;
		}

		// логин и сохранение accessToken
		const loginRes = await authTestManager.login<{ accessToken: string }>({ email, password }, 200);
		accessToken = loginRes.accessToken;
	});

	afterAll(async () => {
		await clearDbs({ auth: prismaAuth, main: prismaMain, files: prismaFiles });

		await Promise.all([prismaAuth.$disconnect(), prismaMain.$disconnect(), prismaFiles.$disconnect()]);
	});

	it("- POST create post without auth -> 401", async () => {
		await postsTestManager.createPost("No auth attempt", 401 /* expected */, undefined /* no token */);
	});

	it("- POST create post with description > 500 -> 400", async () => {
		const long = "a".repeat(501);
		await postsTestManager.createPost(long, 400, accessToken);
	});

	// 200 пустой список (у нового юзера ещё нет постов)
	it("+ GET user posts (empty) -> 200", async () => {
		const body = await postsTestManager.getUserPosts<{
			totalCount: number;
			pageSize: number;
			items: any[];
			pageInfo: { endCursorPostId?: string; hasNextPage: boolean };
		}>(userId, {}, 200, accessToken);

		expect(body.totalCount).toBe(0);
		expect(body.pageSize).toBe(8); // по дефолту
		expect(Array.isArray(body.items)).toBe(true);
		expect(body.items.length).toBe(0);
		expect(body.pageInfo.hasNextPage).toBe(false);
		expect(body.pageInfo.endCursorPostId).toBeUndefined();
	});

	// создадим 3 поста, проверим пагинацию pageSize=2
	it("+ prepare: create 3 posts for pagination", async () => {
		for (const d of ["A", "B", "C"]) {
			const { id } = await postsTestManager.createPost<{ id: string }>(`Post ${d}`, 201, accessToken);
			expect(typeof id).toBe("string");
		}
	});

	// первая страница (2 элемента), hasNextPage=true
	it("+ GET user posts pageSize=2 -> 200 (first page)", async () => {
		const body = await postsTestManager.getUserPosts<any>(userId, { pageSize: 2 }, 200, accessToken);

		expect(body.pageSize).toBe(2);
		expect(body.items.length).toBe(2);
		expect(typeof body.pageInfo.endCursorPostId === "string" || body.pageInfo.endCursorPostId === undefined).toBe(true);
		expect(body.pageInfo.hasNextPage).toBe(true);

		// сохраняем курсор для следующего шага
		(global as any).__endCursor = body.pageInfo.endCursorPostId;
	});

	// вторая страница (оставшийся 1 элемент), hasNextPage=false
	it("+ GET user posts with endCursor -> 200 (second page)", async () => {
		const endCursor = (global as any).__endCursor as string | undefined;
		const body = await postsTestManager.getUserPosts<any>(userId, { pageSize: 2, endCursorPostId: endCursor }, 200, accessToken);

		expect(body.items.length).toBe(1);
		expect(body.pageInfo.hasNextPage).toBe(false);
	});

	// валидация: pageSize=0 -> 400
	it("- GET user posts pageSize=0 -> 400", async () => {
		await postsTestManager.getUserPosts(userId, { pageSize: 0 }, 400, accessToken);
	});

	// валидация: pageSize=9 -> 400
	it("- GET user posts pageSize=9 -> 400", async () => {
		await postsTestManager.getUserPosts(userId, { pageSize: 9 }, 400, accessToken);
	});

	// валидация: endCursorPostId не uuid -> 400
	it("- GET user posts invalid endCursorPostId -> 400", async () => {
		await postsTestManager.getUserPosts(userId, { endCursorPostId: "not-a-uuid" } as any, 400, accessToken);
	});

	it("+ POST create post -> 201 (returns id)", async () => {
		const { id } = await postsTestManager.createPost<{ id: string }>("Test post description", 201, accessToken);

		const createdPost = await prismaMain.post.findUnique({ where: { id } });
		expect(createdPost).toBeTruthy();

		if (createdPost) {
			expect(createdPost.userId).toBe(userId);
			expect(createdPost.description).toBe("Test post description");
		}

		createdPostId = id;
	});

	it("- PUT update post without auth -> 401", async () => {
		await postsTestManager.updatePost(createdPostId, "no auth", 401);
	});

	it("+ PUT update post -> 204 (description changes in DB)", async () => {
		const newText = "Updated description";
		await postsTestManager.updatePost(createdPostId, newText, 204, accessToken);

		const updated = await prismaMain.post.findUnique({ where: { id: createdPostId } });
		expect(updated).not.toBeNull();
		if (updated) {
			expect(updated.description).toBe(newText);
		}
	});

	it("- PUT update post empty description -> 400", async () => {
		await postsTestManager.updatePost(createdPostId, "", 400, accessToken);
	});

	it("- PUT update post description > 500 -> 400", async () => {
		const tooLong = "a".repeat(501);
		await postsTestManager.updatePost(createdPostId, tooLong, 400, accessToken);
	});

	it("- PUT update post with invalid postId (not uuid) -> 400", async () => {
		await postsTestManager.updatePost("not-a-uuid", "desc", 400, accessToken);
	});

	it("- POST unauthorized upload -> 401", async () => {
		await postsTestManager.uploadImages(createdPostId, [tinyPng], 401);
	});

	it("- POST wrong content-type -> 400", async () => {
		await postsTestManager.uploadImages(createdPostId, [], 400, accessToken, true, { some: "json" });
	});

	it("- PUT update non-existing post -> 404", async () => {
		const fakePostId = randomUUID();
		await postsTestManager.updatePost(fakePostId, "does not exist", 404, accessToken);
	});

	// 401 — без авторизации
	it("- DELETE post without auth -> 401", async () => {
		// создаём свой пост, который будем пробовать удалить без токена
		const { id } = await postsTestManager.createPost<{ id: string }>("to delete (no auth)", 201, accessToken);
		await postsTestManager.deletePost(id, 401 /* expected */, undefined /* no token */);
	});

	// 400 — не-UUID
	it("- DELETE post with invalid postId (not uuid) -> 400", async () => {
		await postsTestManager.deletePost("not-a-uuid", 400, accessToken);
	});

	// 404 — несуществующий пост
	it("- DELETE non-existing post -> 404", async () => {
		const fakeId = randomUUID();
		await postsTestManager.deletePost(fakeId, 404, accessToken);
	});

	it("- PUT update someone else's post -> 403", async () => {
		// создаём пост вторым юзером
		const { id: otherPostId } = await postsTestManager.createPost<{ id: string }>("Post owned by other user", 201, otherAccessToken);

		// пытаемся обновить этот пост токеном первого юзера → 403
		await postsTestManager.updatePost(otherPostId, "hacked update", 403, accessToken);
	});

	it("- POST more than 10 files -> 400", async () => {
		// 11 «пустых» PNG (1x1)
		const files = Array.from({ length: 11 }, () => tinyPng);

		await postsTestManager.uploadImages(createdPostId, files, 400, accessToken);
	});

	it("+ POST authorized upload 1 file -> 201", async () => {
		const body = await postsTestManager.uploadImages<ImageOutputDto[]>(createdPostId, [tinyPng], 201, accessToken);

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

	it("- DELETE someone else's post -> 403", async () => {
		// создаём пост вторым пользователя
		const { id: otherPostId } = await postsTestManager.createPost<{ id: string }>("owned by other user", 201, otherAccessToken);

		// пытаемся удалить пост токеном первого пользователя → 403
		await postsTestManager.deletePost(otherPostId, 403, accessToken);
	});

	it("+ DELETE own post -> 204 (and removed in DB)", async () => {
		// создаём пост
		const { id } = await postsTestManager.createPost<{ id: string }>("delete me", 201, accessToken);

		// удаляем
		await postsTestManager.deletePost(id, 204, accessToken);

		const found = await prismaMain.post.findUnique({ where: { id } });
		expect(found).not.toBeNull();
		if (found) {
			expect(found.deletedAt).not.toBeNull(); // софт делит
		}
	});
});

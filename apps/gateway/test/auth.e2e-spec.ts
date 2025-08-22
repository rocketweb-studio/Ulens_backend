import { initSettings } from "./helpers/init-settings";
import { AuthTestManager } from "./helpers/auth-test-manager";
import { INestApplication } from "@nestjs/common";

// тесты для MockController
describe("AuthController", () => {
	let authTestManager: AuthTestManager;
	let app: INestApplication;

	beforeAll(async () => {
		const result = await initSettings();
		authTestManager = result.authTestManger;
		app = result.app;
	});

	afterAll(async () => {
		await app.close();
	});
	it("should register user", async () => {
		const paylaod = {
			userName: "john_doe",
			email: "user.email@gmail.com",
			password: "123123123",
		};
		const userResult = await authTestManager.registerUser(paylaod);
		console.log(userResult);
	});

	it("should clear database", async () => {
		const userResult = await authTestManager.clearDatabase();
		expect(userResult).toBeDefined();
		expect(userResult).toBe("clear database");
	});
});

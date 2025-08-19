import { initSettings } from "./helpers/init-settings";
import { AuthTestManager } from "./helpers/auth-test-manager";

// тесты для MockController
describe("AuthController", () => {
	let authTestManager: AuthTestManager;

	beforeAll(async () => {
		const result = await initSettings();
		authTestManager = result.authTestManger;
	});

	describe("getUsers", () => {
		it("should return users", async () => {
			const userResult = await authTestManager.getUsers();
			expect(userResult).toBeDefined();
			expect(userResult).toBeInstanceOf(Array);
		});

		it("should clear database", async () => {
			const userResult = await authTestManager.clearDatabase();
			expect(userResult).toBeDefined();
			expect(userResult).toBe("clear database");
		});
	});
});

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

	// describe("getUsers", () => {
	// 	it("should return users", async () => {
	// 		const userResult = await authTestManager.getUsers();
	// 		console.log('userResult:', userResult);
	// 		expect(userResult).toBeDefined();
	// 		expect(userResult).toBeInstanceOf(Array);
	// 	});

	// 	it("should clear database", async () => {
	// 		const userResult = await authTestManager.clearDatabase();
	// 		expect(userResult).toBeDefined();
	// 		expect(userResult).toBe("clear database");
	// 	});
	// });

	describe("RegistrationFlow", () => {
		it("- POST failed registration with incorrect input", async () => {
			await authTestManager.registration({ userName: "Fa", email: "cat2021gmail.com", password: "12345" }, 400, {
				errorsMessages: [
					{
						message: "userName must be longer than or equal to 6 characters; Received value: Fa",
						field: "userName",
					},
					{
						message: "The email must match the format example@example.com; Received value: cat2021gmail.com",
						field: "email",
					},
					{
						message: "password must be longer than or equal to 6 characters; Received value: 12345",
						field: "password",
					},
				],
			},
			);
		});

		it("+ POST successed registration with correct input", async () => {
			await authTestManager.registration(
				{
					userName: "Eugene",
					email: "eugene.novik.dev@gmail.com",
					password: "123456"
				},
				204
			);
		});
	});

	it("should clear database", async () => {
		const userResult = await authTestManager.clearDatabase();
		expect(userResult).toBeDefined();
		expect(userResult).toBe("clear database");
	});
});

import { initSettings } from "./helpers/init-settings";
import { AuthTestManager } from "./helpers/auth-test-manager";
import { MainTestManager } from "./helpers/main-test-manager";
import { getAuthPrisma } from "./helpers/get-auth-prisma";
import { randomUUID } from "crypto";

// тесты для MockController
describe("AuthController", () => {
	let authTestManager: AuthTestManager;
	let mainTestManager: MainTestManager;
	let prismaAuth: ReturnType<typeof getAuthPrisma>;

	// переменные используемые во время тестов
	let confirmationCode: string;
	let _recoveryCode: string;

	beforeAll(async () => {
		const result = await initSettings();
		authTestManager = result.authTestManger;
		mainTestManager = result.mainTestManager;

		prismaAuth = getAuthPrisma(); // используем для прямого обращения к тестовой БД во время выполнения тестов
		await prismaAuth.$connect(); // подключаемся к БД перед началом выполнения тестов
	});

	afterAll(async () => {
		await Promise.all([authTestManager.clearDatabase(), mainTestManager.clearDatabase()]);
		await prismaAuth.$disconnect(); // отключаемся от БД после выполнения тестов
	});

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
			});
		});

		it("+ POST successed registration with correct input", async () => {
			const email = "joseph.biden.dev@gmail.com";
			await authTestManager.registration(
				{
					userName: "Joseph",
					email,
					password: "123456",
				},
				204,
			);

			const user = await prismaAuth.user.findUnique({ where: { email } });
			expect(user).toBeTruthy();
			confirmationCode = user?.confirmationCode ?? "";
		});

		it("- POST failed registration-confirmation with incorrect code", async () => {
			const randomCode = randomUUID();
			await authTestManager.registrationConfirmation(randomCode, 400);
		});

		it("+ POST successed registration-confirmation with correct code", async () => {
			await authTestManager.registrationConfirmation(confirmationCode, 204);
		});
	});
});

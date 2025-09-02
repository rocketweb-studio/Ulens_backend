import { initSettings } from "./helpers/init-settings";
import { AuthTestManager } from "./helpers/auth-test-manager";
import { randomUUID } from "crypto";
import { getPrismaClient } from "./helpers/get-prisma";

describe("AuthController", () => {
	let authTestManager: AuthTestManager;

	// переменные используемые во время тестов
	let confirmationCode: string;
	let recoveryCode: string;
	const randomCode: string = randomUUID();
	const password: string = "123456";
	const email: string = "joseph.biden.dev@gmail.com";
	const newPassword: string = "123457";
	let passwordHash: string;
	let accessToken: string;
	let newAccessToken: string;
	let prismaAuth: any;

	beforeAll(async () => {
		const result = await initSettings();
		authTestManager = result.authTestManger;

		prismaAuth = getPrismaClient("auth");
		await prismaAuth.$connect();
	});

	afterAll(async () => {
		await prismaAuth.session.deleteMany();
		await prismaAuth.tokensBlacklist.deleteMany();
		await prismaAuth.profile.deleteMany();
		await prismaAuth.user.deleteMany();
		await prismaAuth.$disconnect();
		// await Promise.all([authTestManager.clearDatabase(), mainTestManager.clearDatabase()]);
		// await prismaAuth.$disconnect(); // отключаемся от БД после выполнения тестов
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
			await authTestManager.registration(
				{
					userName: "Joseph",
					email,
					password,
				},
				204,
			);
		});

		it("- POST failed registration-email-resending with incorrect email", async () => {
			await authTestManager.registrationEmailResending("incorrect.email.com", 400);
		});

		it("+ POST successed registration-email-resending with correct email", async () => {
			await authTestManager.registrationEmailResending(email, 204);

			const user = await prismaAuth.user.findUnique({ where: { email } });
			expect(user).toBeTruthy();
			/**
			 * двойной знак вопроса вернет левое значение если оно не null или undefined, в противном случае вернет правое значение
			 */
			confirmationCode = user?.confirmationCode ?? "";
		});
		//
		it("- POST failed registration-confirmation with incorrect code", async () => {
			await authTestManager.registrationConfirmation(randomCode, 400);
		});

		it("+ POST successed registration-confirmation with correct code", async () => {
			await authTestManager.registrationConfirmation(confirmationCode, 204);
		});

		it("- POST failed password-recovery with incorrect email", async () => {
			await authTestManager.passwordRecovery("incorrect.email.com", 400);
		});

		it("- POST successed password-recovery with correct email", async () => {
			await authTestManager.passwordRecovery(email, 204);

			const user = await prismaAuth.user.findUnique({ where: { email } });
			expect(user).toBeTruthy();

			recoveryCode = user?.recoveryCode ?? "";
			passwordHash = user?.passwordHash ?? "";
		});

		it("- POST failed check-recovery-code with incorrect code", async () => {
			await authTestManager.checkRecoveryCode(randomCode, 400);
		});

		it("+ POST successed check-recovery-code with correct code", async () => {
			await authTestManager.checkRecoveryCode(recoveryCode, 200);
		});

		it("- POST failed new-password with incorrect recovery code", async () => {
			await authTestManager.newPassword({ newPassword, recoveryCode: randomCode }, 400);
		});

		it("+ POST successed new-password with correct recovery code", async () => {
			await authTestManager.newPassword({ newPassword, recoveryCode }, 204);

			const user = await prismaAuth.user.findUnique({ where: { email } });
			expect(user).toBeTruthy();

			const newPasswordHash = user?.passwordHash ?? "";
			expect(newPasswordHash).not.toEqual(passwordHash);
		});

		it("- POST failed login with incorrect input", async () => {
			await authTestManager.login({ email: "incorrect.email.com", password: "123" }, 400, {
				errorsMessages: [
					{
						message: "email must be an email; Received value: incorrect.email.com",
						field: "email",
					},
				],
			});
		});

		it("- POST failed login with incorrect email", async () => {
			await authTestManager.login({ email: "unregistred.user@email.coom", password: "somepassword" }, 401);
		});

		it("- POST failed login with old password that was reset lately", async () => {
			await authTestManager.login({ email, password }, 401);
		});

		it("- POST failed login with incorrect password", async () => {
			await authTestManager.login({ email, password: "wrongPassword" }, 401);
		});

		it("+ POST successed login with correct input", async () => {
			const res = await authTestManager.login<{ accessToken: string }>({ email, password: newPassword }, 200);

			accessToken = res?.accessToken ?? "";
		});

		it("- POST 6th failed attempt to login during 10 seconds", async () => {
			await authTestManager.login({ email, password: newPassword }, 429);
		});

		it("+ POST successed refresh token", async () => {
			await new Promise((res) => setTimeout(res, 1100)); // ждем чтобы iat добавила 1 секунду и новый токен отличался от старого

			const res = await authTestManager.refreshToken<{ accessToken: string }>(200);

			newAccessToken = res?.accessToken ?? "";
			expect(accessToken).not.toEqual(newAccessToken);
		});

		it("+ GET successed auth/me request", async () => {
			await authTestManager.me(200);
		});

		it("+ POST successed user loged out", async () => {
			await authTestManager.logout(204);
		});

		it("- POST failed attempt to refresh token after loggout", async () => {
			await authTestManager.refreshToken<{ accessToken: string }>(401);
		});

		it("- GET failed auth/me request after user was log out", async () => {
			await authTestManager.me(401);
		});

		it("- POST failed user attempt to loged out", async () => {
			await authTestManager.logout(401);
		});
	});
});

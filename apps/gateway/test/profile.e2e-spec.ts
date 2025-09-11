import { initSettings } from "./helpers/init-settings";
import { AuthTestManager } from "./helpers/auth-test-manager";
import { getPrismaClient } from "./helpers/get-prisma";
import { ProfileTestManager } from "./helpers/profile-test-manager";
import { ProfileInputDto, ProfileOutputDto, ValidationErrorDto } from "@libs/contracts/index";

describe("ProfileController", () => {
	let authTestManager: AuthTestManager;
	let profileTestManager: ProfileTestManager;
	let accessUserToken: string;

	// переменные используемые во время тестов
	const userDtoForLogin = {
		userName: "Joseph",
		email: "joseph.biden.dev@gmail.com",
		password: "Pass123456!",
	};
	const userDtoForUpdate: ProfileInputDto = {
		userName: "JohnDoe",
		firstName: "John",
		lastName: "Doe",
		city: "New York",
		country: "USA",
		region: "NY",
		dateOfBirth: new Date("2000-01-01"),
		aboutMe: "I am a software engineer",
	};
	const tinyPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAA" + "AAC0lEQVR42mP8/x8AAwMCAO6l2mUAAAAASUVORK5CYII=", "base64");

	let prismaAuth: any;
	let registeredUser: any;

	beforeAll(async () => {
		const result = await initSettings();
		authTestManager = result.authTestManger;
		profileTestManager = result.profileTestManger;

		prismaAuth = getPrismaClient("auth");
		await prismaAuth.$connect();

		// регистрация + подтверждение
		await authTestManager.registration(userDtoForLogin);
		const user = await prismaAuth.user.findUnique({ where: { email: userDtoForLogin.email } });
		registeredUser = user;
		const code = user.confirmationCode;
		await authTestManager.registrationConfirmation(code);
		const { accessToken } = await authTestManager.login<{ accessToken: string }>({ email: userDtoForLogin.email, password: userDtoForLogin.password }, 200);
		accessUserToken = accessToken as string;
	});

	afterAll(async () => {
		await prismaAuth.session.deleteMany();
		await prismaAuth.tokensBlacklist.deleteMany();
		await prismaAuth.profile.deleteMany();
		await prismaAuth.user.deleteMany();
		await prismaAuth.$disconnect();
	});

	it("+ GET profile", async () => {
		const profile = await profileTestManager.getProfile(registeredUser.id);
		expect(profile.userName).toBe(userDtoForLogin.userName);
	});

	it("+ UPDATE profile", async () => {
		const profile = (await profileTestManager.updateProfile(userDtoForUpdate, accessUserToken)) as ProfileOutputDto;
		expect(profile.userName).toBe("JohnDoe");
		expect(profile.firstName).toBe("John");
		expect(profile.lastName).toBe("Doe");
		expect(profile.city).toBe("New York");
		expect(profile.country).toBe("USA");
		expect(profile.region).toBe("NY");
		expect(profile.aboutMe).toBe("I am a software engineer");
	});

	it("+ Upload avatar", async () => {
		const avatars = await profileTestManager.uploadAvatar(accessUserToken, tinyPng);
		expect(avatars.length).toBe(2);
		expect(avatars[0].url).toBeDefined();
		expect(avatars[0].width).toBeDefined();
		expect(avatars[0].height).toBeDefined();
		expect(avatars[0].fileSize).toBeDefined();
		expect(avatars[1].url).toBeDefined();
		expect(avatars[1].width).toBeDefined();
		expect(avatars[1].height).toBeDefined();
		expect(avatars[1].fileSize).toBeDefined();
	});

	it("+ Get profile with avatar", async () => {
		const profile = await profileTestManager.getProfile(registeredUser.id);

		expect(profile.avatars.length).toBe(2);
		expect(profile.avatars[0].url).toBeDefined();
		expect(profile.avatars[0].width).toBeDefined();
		expect(profile.avatars[0].height).toBeDefined();
		expect(profile.avatars[0].fileSize).toBeDefined();
		expect(profile.publicationsCount).toBe(0);
		expect(profile.followers).toBe(0);
		expect(profile.following).toBe(0);
	});

	it(" 400 - bad update data", async () => {
		const response = (await profileTestManager.updateProfile({ ...userDtoForUpdate, userName: "a".repeat(31) }, accessUserToken, 400)) as ValidationErrorDto;
		expect(response.errorsMessages.length).toBe(1);
		expect(response.errorsMessages[0].field).toBe("userName");

		const response2 = (await profileTestManager.updateProfile(
			{ ...userDtoForUpdate, dateOfBirth: new Date("2025-01-01") },
			accessUserToken,
			400,
		)) as ValidationErrorDto;
		expect(response2.errorsMessages.length).toBe(1);
		expect(response2.errorsMessages[0].field).toBe("dateOfBirth");
	});
});

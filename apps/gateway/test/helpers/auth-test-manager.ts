import { HttpStatus, INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AuthRouterPaths, RouterPrefix } from "@libs/constants/index";
import type { Response } from "supertest";
import { LoginDto, NewPasswordDto, RecoveryPasswordDto } from "@libs/contracts/index";

export class AuthTestManager {
	private agent: ReturnType<typeof request.agent>;

	constructor(private app: INestApplication) {
		this.agent = request.agent(app.getHttpServer()); // для работы с cookies
	}

	async registration(payload: any, status: HttpStatus = HttpStatus.NO_CONTENT, expectedBody?: unknown): Promise<Response> {
		const server = this.app.getHttpServer();
		const url = `/${RouterPrefix.API_V1}/${AuthRouterPaths.AUTH}/${AuthRouterPaths.REGISTRATION}`;

		const req = request(server).post(url).send(payload);

		const res = expectedBody !== undefined ? await req.expect(status, expectedBody) : await req.expect(status);

		// const res = await request(server).post(url).send(payload).expect(status);
		// console.log('Response--->', res.body);

		return res.body;
	}

	async registrationConfirmation(code: string, status: HttpStatus = HttpStatus.NO_CONTENT): Promise<Response> {
		const server = this.app.getHttpServer();
		const url = `/${RouterPrefix.API_V1}/${AuthRouterPaths.AUTH}/${AuthRouterPaths.REGISTRATION_CONFIRMATION}`;

		const res = await request(server).post(url).send({ code }).expect(status);

		return res.body;
	}

	async registrationEmailResending(email: string, status: HttpStatus): Promise<Response> {
		const server = this.app.getHttpServer();
		const url = `/${RouterPrefix.API_V1}/${AuthRouterPaths.AUTH}/${AuthRouterPaths.REGISTRATION_EMAIL_RESENDING}`;

		const res = await request(server).post(url).send({ email }).expect(status);

		return res.body;
	}

	async passwordRecovery(dto: RecoveryPasswordDto, status: HttpStatus): Promise<Response> {
		const server = this.app.getHttpServer();
		const url = `/${RouterPrefix.API_V1}/${AuthRouterPaths.AUTH}/${AuthRouterPaths.PASSWORD_RECOVERY}`;

		const res = await request(server).post(url).send(dto).expect(status);

		return res.body;
	}

	async checkRecoveryCode(code: string, status: HttpStatus): Promise<Response> {
		const server = this.app.getHttpServer();
		const url = `/${RouterPrefix.API_V1}/${AuthRouterPaths.AUTH}/${AuthRouterPaths.CHECK_RECOVERY_CODE}`;

		const res = await request(server).post(url).send({ code }).expect(status);

		return res.body;
	}

	async newPassword(newPasswordDto: NewPasswordDto, status: HttpStatus): Promise<Response> {
		const server = this.app.getHttpServer();
		const url = `/${RouterPrefix.API_V1}/${AuthRouterPaths.AUTH}/${AuthRouterPaths.NEW_PASSWORD}`;

		const res = await request(server).post(url).send(newPasswordDto).expect(status);

		return res.body;
	}

	async login<T = unknown>(payload: LoginDto, status: HttpStatus, expectedBody?: unknown): Promise<T> {
		const url = `/${RouterPrefix.API_V1}/${AuthRouterPaths.AUTH}/${AuthRouterPaths.LOGIN}`;

		const req = this.agent.post(url).send(payload); // используем agent для работы с куками в тестах

		const res = expectedBody !== undefined ? await req.expect(status, expectedBody) : await req.expect(status);

		return res.body as T;
	}

	async refreshToken<T = unknown>(status: HttpStatus): Promise<T> {
		const url = `/${RouterPrefix.API_V1}/${AuthRouterPaths.AUTH}/${AuthRouterPaths.REFRESH_TOKENS}`;

		const res = await this.agent.post(url).send().expect(status); // используем agent для работы с куками в тестах

		return res.body as T;
	}

	async me(status: HttpStatus): Promise<Response> {
		const url = `/${RouterPrefix.API_V1}/${AuthRouterPaths.AUTH}/${AuthRouterPaths.ME}`;

		const res = await this.agent.get(url).send().expect(status); // используем agent для работы с куками в тестах

		return res.body;
	}

	async logout(status: HttpStatus): Promise<Response> {
		const url = `/${RouterPrefix.API_V1}/${AuthRouterPaths.AUTH}/${AuthRouterPaths.LOGOUT}`;

		const res = await this.agent.post(url).send().expect(status); // используем agent для работы с куками в тестах

		return res.body;
	}
}

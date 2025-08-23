import { HttpStatus, INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AuthMessages, AuthRouterPaths, Microservice, RouterPrefix } from "@libs/constants/index";

export class AuthTestManager {
	constructor(private app: INestApplication) {}

	// async getUsers(): Promise<{ version: string; message: string }> {
	// 	// const response = await request(this.app.getHttpServer()).get(`/api/v1/auth/users`).expect(401);
	// 	const response = await request(this.app.getHttpServer()).get(`/${RouterPrefix.API_V1}/
	// 		${AuthRouterPaths.AUTH}/${AuthRouterPaths.USERS}`).expect(401);

	// 	return response.body;
	// }

	// async createUser(payload: any): Promise<{ version: string; message: string }> {
	// 	const response = await request(this.app.getHttpServer()).post(`/api/v1/users`).send(payload).expect(201);

	// 	return response.body;
	// }

	async registration(payload: any, status: HttpStatus, expectedBody?: unknown): Promise<{ version: string; message: string }> {
		const server = this.app.getHttpServer();
		const url = `/${RouterPrefix.API_V1}/${AuthRouterPaths.AUTH}/${AuthRouterPaths.REGISTRATION}`;

		const req = request(server).post(url).send(payload);

		const res = expectedBody !== undefined ? await req.expect(status, expectedBody) : await req.expect(status);

		// const res = await req;
		// console.log("Response:", res.body);

		return res.body;
	}

	async registrationConfirmation(code: string, status: HttpStatus): Promise<{ version: string; message: string }> {
		const server = this.app.getHttpServer();
		const url = `/${RouterPrefix.API_V1}/${AuthRouterPaths.AUTH}/${AuthRouterPaths.REGISTRATION_CONFIRMATION}`;

		const res = await request(server).post(url).send({ code }).expect(status);

		return res.body;
	}

	clearDatabase() {
		const client = this.app.get(Microservice.AUTH);
		return client.send(AuthMessages.CLEAR_AUTH_DATABASE, {}).toPromise();
	}
}

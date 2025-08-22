import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AuthMessages, Microservice } from "@libs/constants/index";

export class AuthTestManager {
	constructor(private app: INestApplication) {}

	async getUsers(): Promise<{ version: string; message: string }> {
		const response = await request(this.app.getHttpServer()).get(`/api/v1/users`).expect(200);

		return response.body;
	}

	async registerUser(payload: any): Promise<any> {
		const response = await request(this.app.getHttpServer()).post(`/api/v1/auth/registration`).send(payload).expect(204);
		return response.body;
	}

	clearDatabase() {
		const client = this.app.get(Microservice.AUTH);
		return client.send(AuthMessages.CLEAR_AUTH_DATABASE, {}).toPromise();
	}
}

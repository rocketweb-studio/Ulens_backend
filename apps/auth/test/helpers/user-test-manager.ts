import { INestApplication } from "@nestjs/common";
import * as request from "supertest";

/**
 * класс для тестирования MockController.
 * Помогает избежать дублирования кода в тестах, кгда нужно многократно вызывать один и тот же эндпоинт
 * Пример использования можно увидеть в mock.e2e-spec.ts
 */
export class UserTestManager {
	constructor(private app: INestApplication) {}

	async getUsers(): Promise<{ version: string; message: string }> {
		const response = await request(this.app.getHttpServer()).get(`/users`).expect(200);

		return response.body;
	}
}

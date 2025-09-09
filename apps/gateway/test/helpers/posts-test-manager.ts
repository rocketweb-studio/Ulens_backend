// apps/gateway/test/helpers/posts-test-manager.ts
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import type { ImageOutputDto } from "@libs/contracts/index";

export class PostsTestManager {
	private server: any;
	private readonly baseUrl = `/api/v1/posts`;

	constructor(private app: INestApplication) {
		this.server = app.getHttpServer();
	}

	async uploadImages<T = ImageOutputDto[]>(
		postId: string,
		files: Array<Buffer | { path: string; filename?: string }>,
		expectedStatus = 201,
		accessToken?: string,
	): Promise<T> {
		const url = `${this.baseUrl}/${postId}/images`;
		let req = request(this.server).post(url);

		if (accessToken) {
			req = req.set("Authorization", `Bearer ${accessToken}`);
		}

		for (const f of files) {
			if (Buffer.isBuffer(f)) req = req.attach("images", f, "img.jpg");
			else req = req.attach("images", f.path, f.filename ?? "img.jpg");
		}

		const res = await req.expect(expectedStatus);
		return res.body as T;
	}
}

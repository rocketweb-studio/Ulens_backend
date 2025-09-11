import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import type { ImageOutputDto } from "@libs/contracts/index";

export class PostsTestManager {
	private server: any;
	private readonly baseUrl = `/api/v1/posts`;

	constructor(private app: INestApplication) {
		this.server = app.getHttpServer();
	}

	async createPost<T = { id: string }>(description: string, expectedStatus = 201, accessToken?: string): Promise<T> {
		const url = `${this.baseUrl}`;
		let req = request(this.server).post(url).send({ description });

		if (accessToken) {
			req = req.set("Authorization", `Bearer ${accessToken}`);
		}

		const res = await req.expect(expectedStatus);
		return res.body as T;
	}

	async getUserPosts<T = any>(
		userId: string,
		query: { pageSize?: number; endCursorPostId?: string } = {},
		expectedStatus = 200,
		accessToken?: string,
	): Promise<T> {
		const qs = new URLSearchParams();
		if (query.pageSize !== undefined) qs.set("pageSize", String(query.pageSize));
		if (query.endCursorPostId) qs.set("endCursorPostId", query.endCursorPostId);

		const url = `/api/v1/posts/${userId}?${qs.toString()}`;
		let req = request(this.server).get(url);
		if (accessToken) req = req.set("Authorization", `Bearer ${accessToken}`);

		const res = await req.expect(expectedStatus);
		return res.body as T;
	}

	async updatePost(postId: string, description: string, expectedStatus = 204, accessToken?: string): Promise<void> {
		const url = `/api/v1/posts/${postId}`;
		let req = request(this.server).put(url).send({ description });

		if (accessToken) {
			req = req.set("Authorization", `Bearer ${accessToken}`);
		}

		await req.expect(expectedStatus);
	}

	async deletePost(postId: string, expectedStatus = 204, accessToken?: string): Promise<void> {
		const url = `/api/v1/posts/${postId}`;
		let req = request(this.server).delete(url);
		if (accessToken) req = req.set("Authorization", `Bearer ${accessToken}`);
		await req.expect(expectedStatus);
	}

	async uploadImages<T = ImageOutputDto[]>(
		postId: string,
		files: Array<Buffer | { path: string; filename?: string }>,
		expectedStatus = 201,
		accessToken?: string,
		asJson?: boolean,
		jsonBody: any = {},
	): Promise<T> {
		const url = `${this.baseUrl}/${postId}/images`;
		let req = request(this.server).post(url);

		if (accessToken) req = req.set("Authorization", `Bearer ${accessToken}`);

		if (asJson) {
			// отправляем application/json вместо multipart
			const res = await req.send(jsonBody).expect(expectedStatus);
			return res.body as T;
		}

		for (const f of files) {
			if (Buffer.isBuffer(f)) req = req.attach("images", f, "img.jpg");
			else req = req.attach("images", f.path, f.filename ?? "img.jpg");
		}

		const res = await req.expect(expectedStatus);
		return res.body as T;
	}
}

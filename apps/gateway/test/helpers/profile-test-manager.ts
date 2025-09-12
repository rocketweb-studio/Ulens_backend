import { HttpStatus, INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { ProfileRouterPaths, RouterPrefix } from "@libs/constants/index";
import { ProfileInputDto, ProfileOutputDto, ProfileOutputWithAvatarDto, ValidationErrorDto } from "@libs/contracts/index";

export class ProfileTestManager {
	private agent: ReturnType<typeof request.agent>;

	constructor(private app: INestApplication) {
		this.agent = request.agent(app.getHttpServer()); // для работы с cookies
	}

	async getProfile(userId: string, status: HttpStatus = HttpStatus.OK): Promise<ProfileOutputWithAvatarDto> {
		const url = `/${RouterPrefix.API_V1}/${ProfileRouterPaths.PROFILE}/${userId}`;
		const response = await request(this.app.getHttpServer()).get(url).expect(status);
		return response.body;
	}

	async updateProfile(dto: ProfileInputDto, accessToken: string, status: HttpStatus = HttpStatus.OK): Promise<ProfileOutputDto | ValidationErrorDto> {
		const url = `/${RouterPrefix.API_V1}/${ProfileRouterPaths.PROFILE}`;
		const response = await request(this.app.getHttpServer()).put(url).send(dto).set("Authorization", `Bearer ${accessToken}`).expect(status);
		return response.body;
	}

	async uploadAvatar(accessToken: string, tinyPng: Buffer, status: HttpStatus = HttpStatus.CREATED): Promise<any> {
		const url = `/${RouterPrefix.API_V1}/${ProfileRouterPaths.PROFILE}/${ProfileRouterPaths.AVATAR}`;
		const response = await request(this.app.getHttpServer())
			.post(url)
			.set("Authorization", `Bearer ${accessToken}`)
			.attach("avatar", tinyPng, "img.jpg")
			.expect(status);
		return response.body;
	}
}

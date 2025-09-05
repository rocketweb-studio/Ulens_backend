import { Injectable } from "@nestjs/common";
import { IPostQueryRepository } from "@main/modules/post/post.interface";
import { PrismaService } from "@main/core/prisma/prisma.service";
import { GetUserPostsInputDto } from "../dto/get-user-posts.input.dto";

@Injectable()
export class PrismaPostQueryRepository implements IPostQueryRepository {
	constructor(readonly _prisma: PrismaService) {}

	async getUserPosts(_dto: GetUserPostsInputDto): Promise<any> {}

	// async findUserById(id: string): Promise<MeUserViewDto | null> {
	// 	const user = await this.prisma.user.findFirst({
	// 		where: {
	// 			id: id,
	// 			deletedAt: null,
	// 		},
	// 		include: {
	// 			profile: true,
	// 		},
	// 	});

	// 	return user ? this._mapToView(user) : null;
	// }

	// async getMe(dto: RefreshDecodedDto): Promise<MeUserViewDto> {
	// 	const user = await this.prisma.user.findFirst({
	// 		where: {
	// 			id: dto.userId,
	// 			deletedAt: null,
	// 		},
	// 		include: {
	// 			profile: true,
	// 		},
	// 	});

	// 	if (!user) {
	// 		throw new NotFoundRpcException();
	// 	}

	// 	return this._mapToView(user);
	// }

	// async getUsers(): Promise<MeUserViewDto[]> {
	// 	const users = await this.prisma.user.findMany({
	// 		where: {
	// 			deletedAt: null,
	// 		},
	// 		include: {
	// 			profile: true,
	// 		},
	// 	});
	// 	return users.map((user) => this._mapToView(user));
	// }

	// private _mapToView(user: UserWithProfile): MeUserViewDto {
	// 	return {
	// 		id: user.id,
	// 		userName: user.profile?.userName || "",
	// 		email: user.email,
	// 	};
	// }
}

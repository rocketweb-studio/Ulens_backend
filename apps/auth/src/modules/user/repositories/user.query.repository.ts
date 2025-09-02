import { Injectable } from "@nestjs/common";
import { IUserQueryRepository } from "../user.interfaces";
import { PrismaService } from "@auth/core/prisma/prisma.service";
import { BaseUserView } from "@libs/contracts/index";
import { UserWithPayloadFromJwt } from "../dto/user.dto";
import { MeUserViewDto } from "@libs/contracts/auth-contracts/output/me-user-view.dto";

@Injectable()
export class PrismaUserQueryRepository implements IUserQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findUserById(id: string): Promise<BaseUserView | null> {
		const user = await this.prisma.user.findFirst({
			where: {
				id: id,
				deletedAt: null,
			},
			include: {
				profile: true,
			},
		});

		return user ? BaseUserView.mapToView(user) : null;
	}

	async getMe(dto: UserWithPayloadFromJwt): Promise<MeUserViewDto> {
		const user = await this.prisma.user.findFirst({
			where: {
				id: dto.userId,
				deletedAt: null,
			},
			include: {
				profile: true,
			},
		});
		return MeUserViewDto.mapToView(user);
	}

	async getUsers(): Promise<BaseUserView[]> {
		const users = await this.prisma.user.findMany({
			where: {
				deletedAt: null,
			},
			include: {
				profile: true,
			},
		});
		return users.map((user) => BaseUserView.mapToView(user));
	}
}

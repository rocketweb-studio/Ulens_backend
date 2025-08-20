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
			},
		});

		return user ? BaseUserView.mapToView(user) : null;
	}

	async getMe(dto: UserWithPayloadFromJwt): Promise<MeUserViewDto> {
		const user = await this.prisma.user.findFirst({
			where: {
				id: dto.userId,
			},
		});
		return MeUserViewDto.mapToView(user);
	}

	async getUsers(): Promise<BaseUserView[]> {
		const users = await this.prisma.user.findMany();
		return users.map((user) => BaseUserView.mapToView(user));
	}
}

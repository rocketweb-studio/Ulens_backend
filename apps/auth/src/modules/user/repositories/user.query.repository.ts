import { Injectable } from "@nestjs/common";
import { IUserQueryRepository } from "@auth/modules/user/user.interfaces";
import { PrismaService } from "@auth/core/prisma/prisma.service";
import { MeUserViewDto } from "@libs/contracts/index";
import { Prisma } from "@auth/core/prisma/generated/client";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";
import { RefreshDecodedDto } from "@auth/modules/user/dto/refresh-decoded.dto";

type UserWithProfile = Prisma.UserGetPayload<{
	include: { profile: true };
}>;

@Injectable()
export class PrismaUserQueryRepository implements IUserQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findUserById(id: string): Promise<MeUserViewDto | null> {
		const user = await this.prisma.user.findFirst({
			where: {
				id: id,
				deletedAt: null,
			},
			include: {
				profile: true,
			},
		});

		return user ? this._mapToView(user) : null;
	}

	async getMe(dto: RefreshDecodedDto): Promise<MeUserViewDto> {
		const user = await this.prisma.user.findFirst({
			where: {
				id: dto.userId,
				deletedAt: null,
			},
			include: {
				profile: true,
			},
		});

		if (!user) {
			throw new NotFoundRpcException();
		}

		return this._mapToView(user);
	}

	async getUsers(): Promise<MeUserViewDto[]> {
		const users = await this.prisma.user.findMany({
			where: {
				deletedAt: null,
			},
			include: {
				profile: true,
			},
		});
		return users.map((user) => this._mapToView(user));
	}

	private _mapToView(user: UserWithProfile): MeUserViewDto {
		return {
			id: user.id,
			userName: user.profile?.userName || "",
			email: user.email,
		};
	}
}

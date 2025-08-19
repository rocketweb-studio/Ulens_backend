import { Injectable } from "@nestjs/common";
import { IUserQueryRepository } from "../user.interfaces";
import { PrismaService } from "@auth/core/prisma/prisma.service";
import { BaseUserView } from "@libs/contracts/index";

@Injectable()
export class PrismaUserQueryRepository implements IUserQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	// async findUserByConfirmationCode(dto: ConfirmCodeDto): Promise<BaseUserView | null> {
	//     const user = await this.prisma.user.findFirst({
	//         where: {
	//             confirmationCode: dto.code,
	//             confCodeConfirmed: false,
	//             confCodeExpDate: { gte: new Date() },
	//         }
	//     })

	//     return user ? BaseUserView.mapToView(user) : null;
	// }

	async findUserById(id: number): Promise<BaseUserView | null> {
		const user = await this.prisma.user.findFirst({
			where: {
				id: id,
			},
		});

		return user ? BaseUserView.mapToView(user) : null;
	}
}

import { Injectable } from "@nestjs/common";
import { PrismaService } from "@payments/core/prisma/prisma.service";

import { ISubscriptionQueryRepository } from "../subscription.interface";

@Injectable()
export class PrismaSubscriptionQueryRepository implements ISubscriptionQueryRepository {
	constructor(private readonly prisma: PrismaService) {}

	getUniqueSubscription(planCode: string): Promise<any> {
		const result = this.prisma.plan.findUnique({
			where: { code: planCode },
		});
		return result;
	}
}

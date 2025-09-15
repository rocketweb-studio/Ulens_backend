import { Injectable } from "@nestjs/common";
import { PrismaService } from "@payments/core/prisma/prisma.service";

import { ISubscriptionQueryRepository } from "../subscription.interface";

@Injectable()
export class PrismaSubscriptionQueryRepository implements ISubscriptionQueryRepository {
	constructor(readonly _prisma: PrismaService) {}
}

import { IMessengerQueryRepository } from "@messenger/modules/messenger/messenger.interface";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@messenger/core/prisma/prisma.service";

@Injectable()
export class MessengerQueryRepository implements IMessengerQueryRepository {
	constructor(private readonly prisma: PrismaService) {}
}

import { INBOX_STATUS } from "@libs/constants/outbox-statuses.constants";
import { CreateInboxMessageDto } from "@messenger/modules/event-store/dto/create-inbox.dto";
import { PrismaService } from "@messenger/core/prisma/prisma.service";
import { IInboxCommandRepository } from "@messenger/modules/event-store/inbox.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class InboxCommandRepository implements IInboxCommandRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createInboxMessage(dto: CreateInboxMessageDto): Promise<boolean> {
		const createdInboxMessage = await this.prisma.inboxEvent.createMany({
			data: [{ ...dto, processedAt: new Date(), status: INBOX_STATUS.PROCESSED }],
			skipDuplicates: true,
		});

		return !!createdInboxMessage;
	}
}

// import { INBOX_STATUS } from "@libs/constants/outbox-statuses.constants";
// import { CreateInboxMessageDto } from "@notifications/modules/event-store/dto/create-inbox.dto";
// import { PrismaService } from "@notifications/core/prisma/prisma.service";
// import { IInboxCommandRepository } from "@notifications/modules/event-store/inbox.interface";
// import { Injectable } from "@nestjs/common";

// @Injectable()
// export class InboxCommandRepository implements IInboxCommandRepository {
// 	constructor(private readonly prisma: PrismaService) {}

// 	async createInboxMessage(dto: CreateInboxMessageDto): Promise<boolean> {
// 		const createdInboxMessage = await this.prisma.inboxEvent.createMany({
// 			data: [{ ...dto, processedAt: new Date(), status: INBOX_STATUS.PROCESSED }],
// 			skipDuplicates: true,
// 		});

// 		return !!createdInboxMessage;
// 	}
// }

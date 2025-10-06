import { Injectable } from "@nestjs/common";
import { CreateInboxMessageDto } from "@notifications/modules/event-store/dto/create-inbox.dto";
import { IInboxCommandRepository } from "@notifications/modules/event-store/inbox.interface";

@Injectable()
export class InboxService {
	constructor(private readonly inboxCommandRepository: IInboxCommandRepository) {}

	async createInboxMessage(dto: CreateInboxMessageDto): Promise<boolean> {
		return await this.inboxCommandRepository.createInboxMessage(dto);
	}
}

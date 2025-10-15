import { Injectable } from "@nestjs/common";
import { IInboxCommandRepository } from "@payments/modules/event-store/inbox.interface";
import { CreateInboxEventDto } from "@payments/modules/event-store/dto/create-inbox.dto";

@Injectable()
export class InboxService {
	constructor(private readonly inboxCommandRepository: IInboxCommandRepository) {}

	async createInboxMessage(dto: CreateInboxEventDto): Promise<boolean> {
		return await this.inboxCommandRepository.createInboxMessageWithoutTransaction(dto);
	}
}

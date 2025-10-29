import { CreateInboxMessageDto } from "@main/modules/event-store/dto/create-inbox.dto";

export abstract class IInboxCommandRepository {
	abstract createInboxMessage(dto: CreateInboxMessageDto): Promise<boolean>;
}

import { CreateInboxEventDto } from "@auth/modules/event-store/dto/create-inbox.dto";
import { UpdateInboxEventDto } from "@auth/modules/event-store/dto/update-inbox.dto";

export abstract class IInboxCommandRepository {
	abstract createInboxMessage(tx: any, dto: CreateInboxEventDto): Promise<boolean>;
	abstract updateInboxMessage(tx: any, dto: UpdateInboxEventDto): Promise<boolean>;
}

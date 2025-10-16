import { INBOX_STATUS } from "@libs/constants/outbox-statuses.constants";
import { RabbitEventSources } from "@libs/rabbit/rabbit.constants";

export class CreateInboxEventDto {
	id: string;
	type: string;
	source: RabbitEventSources;
	payload: any;
	status: INBOX_STATUS;
}

import { INBOX_STATUS } from "@libs/constants/outbox-statuses.constants";

export class CreateInboxEventDto {
	id: string;
	type: string;
	source: string;
	payload: any;
	status: INBOX_STATUS;
}

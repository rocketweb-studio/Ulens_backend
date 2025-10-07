import { INBOX_STATUS } from "@libs/constants/outbox-statuses.constants";

export class UpdateInboxEventDto {
	id: string;
	status: INBOX_STATUS;
}

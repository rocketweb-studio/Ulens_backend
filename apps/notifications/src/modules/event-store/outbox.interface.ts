import { CreateOutboxToGatewayDto, CreateOutboxToPaymentsDto } from "@notifications/modules/event-store/dto/create-outbox.dto";

export abstract class IOutboxCommandRepository {
	abstract createOutboxNotificationToGatewayEvent(dto: CreateOutboxToGatewayDto): Promise<string>;
	abstract createOutboxNotificationToPaymentsEvent(dto: CreateOutboxToPaymentsDto): Promise<string>;
	abstract findPendingOutboxEvents(chanckSize: number): Promise<any[]>;
	abstract updateOutboxPendingEvent(id: string): Promise<any>;
	abstract updateOutboxPublishedEvent(id: string, publishedAt: Date): Promise<any>;
	abstract updateOutboxFailedEvent(id: string, next: Date): Promise<any>;
}

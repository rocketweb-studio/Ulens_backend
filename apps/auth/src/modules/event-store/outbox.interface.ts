import { CreateOutBoxPremiumActivatedEventDto } from "@auth/modules/event-store/dto/create-outbox-premium-event.dto";

export abstract class IOutboxCommandRepository {
	abstract createOutboxPremiumActivatedEvent(dto: CreateOutBoxPremiumActivatedEventDto): Promise<string>;
	abstract findPendingOutboxEvents(chanckSize: number): Promise<any[]>;
	abstract updateOutboxPendingEvent(id: string): Promise<any>;
	abstract updateOutboxPublishedEvent(id: string): Promise<any>;
	abstract updateOutboxFailedEvent(id: string, next: Date): Promise<any>;
}

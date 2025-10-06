import { Injectable } from "@nestjs/common";
import { IOutboxCommandRepository } from "@auth/modules/event-store/outbox.interface";
import { CreateOutBoxPremiumActivatedEventDto } from "@auth/modules/event-store/dto/create-outbox-premium-event.dto";

@Injectable()
export class OutboxService {
	constructor(private readonly outboxCommandRepository: IOutboxCommandRepository) {}

	async createOutboxPremiumActivatedEvent(dto: CreateOutBoxPremiumActivatedEventDto): Promise<string> {
		const createdOutboxTransactionEvent = await this.outboxCommandRepository.createOutboxPremiumActivatedEvent(dto);
		return createdOutboxTransactionEvent;
	}

	async updateOutboxPendingEvent(id: string): Promise<any> {
		return this.outboxCommandRepository.updateOutboxPendingEvent(id);
	}

	async updateOutboxPublishedEvent(id: string): Promise<any> {
		return this.outboxCommandRepository.updateOutboxPublishedEvent(id);
	}

	async updateOutboxFailedEvent(id: string, next: Date): Promise<any> {
		return this.outboxCommandRepository.updateOutboxFailedEvent(id, next);
	}

	async findPendingOutboxEvents(chanckSize = 50): Promise<any[]> {
		return this.outboxCommandRepository.findPendingOutboxEvents(chanckSize);
	}
}

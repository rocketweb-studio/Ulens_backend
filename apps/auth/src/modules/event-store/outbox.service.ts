import { Injectable } from "@nestjs/common";
import { IOutboxCommandRepository } from "@auth/modules/event-store/outbox.interface";
import { CreateOutBoxPremiumActivatedEventDto } from "@auth/modules/event-store/dto/create-outbox-premium-event.dto";

@Injectable()
export class OutboxService {
	constructor(private readonly outboxCommandRepository: IOutboxCommandRepository) {}

	// todo реализовать как в методе ниже
	async createOutboxPremiumActivatedEvent(dto: CreateOutBoxPremiumActivatedEventDto): Promise<string> {
		const createdOutboxTransactionEvent = await this.outboxCommandRepository.createOutboxPremiumActivatedEvent(dto);
		return createdOutboxTransactionEvent;
	}

	//* реализуем сразу из репозитория, т.к. нет необходимости в сервисе
	// async createOutboxUserDeletedEvent(dto: CreateOutboxUserDeletedDto): Promise<string> {
	// 	const createdOutboxUserDeletedEvent = await this.outboxCommandRepository.createOutboxUserDeletedEvent(dto);
	// 	return createdOutboxUserDeletedEvent;
	// }

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

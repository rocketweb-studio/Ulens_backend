import { Injectable } from "@nestjs/common";
import { CreateOutboxNotificationEmailEventDto } from "./dto/create-outbox-notification-email-event.dto";
import { CreateOutBoxTransactionEventDto } from "./dto/create-outbox-transaction-event.dto";
import { IOutboxCommandRepository } from "./outbox.interface";
import { PlanService } from "../plan/plan.service";
import { CreateOutboxNotificationRenewalCheckedEventDto } from "./dto/create-outbox-notification-renewal-event.dto";

@Injectable()
export class OutboxService {
	constructor(
		private readonly outboxCommandRepository: IOutboxCommandRepository,
		private readonly planService: PlanService,
	) {}

	async createOutboxTransactionEvent(dto: CreateOutBoxTransactionEventDto): Promise<string> {
		const createdOutboxTransactionEvent = await this.outboxCommandRepository.createOutboxTransactionEvent(dto);
		return createdOutboxTransactionEvent;
	}

	async createOutboxNotificationEmailEvent(dto: CreateOutboxNotificationEmailEventDto): Promise<string> {
		const plan = await this.planService.findPlanById(+dto.planId);
		const outboxNotificationEvent = {
			...dto,
			plan_name: plan.title,
			plan_interval: plan.interval,
			plan_price: plan.price,
			plan_description: plan.description,
		};
		const createdOutboxNotificationEvent = await this.outboxCommandRepository.createOutboxNotificationEmailEvent(outboxNotificationEvent);
		return createdOutboxNotificationEvent;
	}

	async createOutboxNotificationRenewalCheckedEvent(dto: CreateOutboxNotificationRenewalCheckedEventDto): Promise<string> {
		const createdOutboxNotificationEvent = await this.outboxCommandRepository.createOutboxNotificationRenewalCheckedEvent(dto);
		return createdOutboxNotificationEvent;
	}

	async findPendingOutboxEvents(chanckSize = 50): Promise<any[]> {
		return this.outboxCommandRepository.findPendingOutboxEvents(chanckSize);
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
}

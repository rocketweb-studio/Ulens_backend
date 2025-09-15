import { Inject, Injectable } from "@nestjs/common";
import { Microservice, PaymentsMessages } from "@libs/constants/index";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

// Idempotency-Key
export class SubscInputDto {
	planCode: string;
	provider: string;
	userId: string;
	idempotencyKey: string;
}

@Injectable()
export class SubscriptionsClientService {
	constructor(@Inject(Microservice.PAYMENTS) private readonly paymentsClient: ClientProxy) {}

	async createSubscription(dto: SubscInputDto) {
		const result = await firstValueFrom(this.paymentsClient.send({ cmd: PaymentsMessages.CREATE_SUBSCRIPTION }, dto));
		return result;
	}
}

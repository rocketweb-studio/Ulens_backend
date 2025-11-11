import { Microservice } from "@libs/constants/microservices";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { PaymentsMessages } from "@libs/constants/payment-messages";
import { firstValueFrom } from "rxjs";
import {
	PaymentInputDto,
	PlanInputDto,
	PaymentOutputDto,
	SubscriptionOutputDto,
	PaginationWithSortQueryDto,
	TransactionWithPageInfoOutputDto,
} from "@libs/contracts/index";
import { NotFoundRpcException, UnauthorizedRpcException } from "@libs/exeption/rpc-exeption";
import { AuthClientService } from "../auth/auth-client.service";
import { GetPaymentsInput } from "./payments_gql/inputs/get-payments.input";

@Injectable()
export class PaymentsClientService {
	constructor(
		@Inject(Microservice.PAYMENTS) private readonly client: ClientProxy,
		private readonly authClientService: AuthClientService,
	) {}

	async getPlans(): Promise<any> {
		const plans = await firstValueFrom(this.client.send({ cmd: PaymentsMessages.GET_PLANS }, {}));

		return plans;
	}

	async createPlan(plan: PlanInputDto): Promise<string> {
		const createdPlan = await firstValueFrom(this.client.send({ cmd: PaymentsMessages.CREATE_PLAN }, { plan }));

		return createdPlan;
	}

	async deletePlan(id: string): Promise<void> {
		await firstValueFrom(this.client.send({ cmd: PaymentsMessages.DELETE_PLAN }, { id }));

		return;
	}

	async webhookStripe(rawBody: any, stripeSignature: string): Promise<void> {
		if (!stripeSignature) {
			throw new UnauthorizedRpcException("Stripe signature is required in headers");
		}
		await firstValueFrom(this.client.send({ cmd: PaymentsMessages.WEBHOOK_STRIPE }, { rawBody: rawBody.toString("utf8"), stripeSignature }));

		return;
	}

	async webhookPayPal(data: any): Promise<void> {
		const eventType = data.event_type;
		const resource = data.resource;
		await firstValueFrom(this.client.send({ cmd: PaymentsMessages.WEBHOOK_PAYPAL }, { eventType, resource }));
		return;
	}

	async makePayment(payment: PaymentInputDto, userId: string): Promise<PaymentOutputDto> {
		const user = await this.authClientService.me(userId);
		const madePayment = await firstValueFrom(this.client.send({ cmd: PaymentsMessages.MAKE_PAYMENT }, { payment, user }));

		return madePayment;
	}

	async getTransactionsByUserId(userId: string, query: PaginationWithSortQueryDto): Promise<TransactionWithPageInfoOutputDto> {
		const user = await this.authClientService.me(userId);
		if (!user) {
			throw new NotFoundRpcException("User not found");
		}
		const transactions = await firstValueFrom(this.client.send({ cmd: PaymentsMessages.GET_TRANSACTIONS_BY_USER_ID }, { userId, query }));

		return transactions;
	}

	async getCurrentSubscription(userId: string): Promise<SubscriptionOutputDto> {
		const subscription = await firstValueFrom(this.client.send({ cmd: PaymentsMessages.GET_SUBSCRIPTION }, { userId }));

		return subscription;
	}

	async autoRenewalSubscription(userId: string, isAutoRenewal: boolean): Promise<void> {
		await firstValueFrom(this.client.send({ cmd: PaymentsMessages.AUTO_RENEWAL_SUBSCRIPTION }, { userId, isAutoRenewal }));
		return;
	}

	async getTransactionsByUserIds(userIds: string[], query: Omit<GetPaymentsInput, "search">) {
		const transactions = await firstValueFrom(this.client.send({ cmd: PaymentsMessages.GET_TRANSACTIONS_BY_USER_IDS }, { userIds, query }));
		return transactions;
	}

	async getTransactions(query: Omit<GetPaymentsInput, "search">): Promise<TransactionWithPageInfoOutputDto> {
		const transactions = await firstValueFrom(this.client.send({ cmd: PaymentsMessages.GET_TRANSACTIONS }, { query }));
		return transactions;
	}
}

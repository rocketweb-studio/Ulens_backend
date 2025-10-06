import { MeUserViewDto, PaymentInputDto, PaymentProvidersEnum } from "@libs/contracts/index";
import { Injectable } from "@nestjs/common";
import { StripeService } from "@payments/core/stripe/stripe.service";
import { PaymentOutputDto } from "@libs/contracts/index";
import { ITransactionCommandRepository } from "@payments/modules/transaction/transaction.interface";
import { UpdateTransactionDto } from "@payments/modules/transaction/dto/update-transaction.dto";
import { BadRequestRpcException, UnexpectedErrorRpcException } from "@libs/exeption/rpc-exeption";
import { SubscriptionService } from "@payments/modules/subscription/subscription.service";
import { CreateTransactionDto } from "@payments/modules/transaction/dto/create-transaction.dto";
import { PayPalService } from "@payments/core/paypal/paypal.service";
import Stripe from "stripe";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PremiumActivatedInput } from "@payments/modules/transaction/dto/permium-activated.input.dto";

@Injectable()
export class TransactionService {
	constructor(
		private readonly stripeService: StripeService,
		private readonly paypalService: PayPalService,
		private readonly transactionCommandRepository: ITransactionCommandRepository,
		private readonly subscriptionService: SubscriptionService,
	) {}

	async createTransaction(dto: CreateTransactionDto): Promise<number> {
		const createdTransaction = await this.transactionCommandRepository.createTransaction(dto);
		return createdTransaction;
	}

	async updateTransaction(id: string | number, provider: PaymentProvidersEnum, data: Partial<UpdateTransactionDto>): Promise<boolean> {
		const isUpdated = await this.transactionCommandRepository.updateTransaction(id, provider, data);
		if (!isUpdated) {
			throw new UnexpectedErrorRpcException("Transaction not updated");
		}
		return isUpdated;
	}

	async makePayment(user: MeUserViewDto, payment: PaymentInputDto, plan: any): Promise<PaymentOutputDto> {
		// проверяем отсутствие активной подписки у пользователя
		const subscription = await this.subscriptionService.getSubscriptionByUserId(user.id);

		if (subscription) {
			throw new BadRequestRpcException("Subscription already exists");
		}

		let payment_url: string;
		// для работы с разными провайдерами
		if (payment.provider === PaymentProvidersEnum.STRIPE) {
			// создаем сессию для оплаты
			const stripeSession: Stripe.Checkout.Session = await this.stripeService.createSubscriptionCheckoutSession(user, plan);
			// создаем транзакцию в бд
			await this.transactionCommandRepository.createTransaction({
				userId: user.id,
				plan,
				stripeSubscriptionId: null,
				stripeSessionId: stripeSession.id,
				paypalSessionId: null,
				paypalPlanId: null,
				provider: payment.provider,
			});
			// получаем ссылку на оплату из ответа stripe
			payment_url = stripeSession.url as string;
		} else if (payment.provider === PaymentProvidersEnum.PAYPAL) {
			// создаем транзакцию в бд
			const transactionId = await this.transactionCommandRepository.createTransaction({
				userId: user.id,
				plan,
				stripeSubscriptionId: null,
				stripeSessionId: null,
				paypalSessionId: null,
				paypalPlanId: plan.paypalPlanId,
				provider: payment.provider,
			});
			// создаем подписку для оплаты
			const paypalSession = await this.paypalService.createPayPalSubscription({
				userId: user.id,
				planId: plan.id,
				paypalPlanId: plan.paypalPlanId,
				transactId: transactionId,
				userName: user.userName,
				userEmail: user.email,
			});
			// получаем ссылку на оплату из ответа paypal
			payment_url = paypalSession.links.find((link) => link.rel === "approve")?.href as string;
		} else {
			throw new Error("Provider not supported");
		}

		return { url: payment_url };
	}

	async findTransactionById(id: string): Promise<any> {
		const transaction = await this.transactionCommandRepository.findTransactionById(+id);
		return transaction;
	}

	async finalizeAfterPremiumActivated(input: PremiumActivatedInput): Promise<void> {
		await this.transactionCommandRepository.finalizeAfterPremiumActivated(input);
	}

	// крон для изменения статуса транзакций на expired, если не произвели оплату
	// в страйпе для этого приходит вебхук но paypal не обрабатывает это событие и мы сами должны контролировать это
	// в страйпе ссылка валидна 24 часа, в paypal ссылка валидна 3 дня, поэтому проверяем раз в день
	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async changeStatusOfExpiredTransactions() {
		await this.transactionCommandRepository.changeStatusOfExpiredTransactions();
	}
}

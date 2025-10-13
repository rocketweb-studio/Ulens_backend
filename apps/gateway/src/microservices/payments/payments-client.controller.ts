import { Controller, Get, Param, Post, Body, Delete, UseGuards, HttpCode, HttpStatus, Headers, RawBody, Query } from "@nestjs/common";
import { PaymentsClientService } from "./payments-client.service";
import {
	PaginationWithSortQueryDto,
	PayloadFromRequestDto,
	PaymentOutputDto,
	PlanInputDto,
	SubscriptionOutputDto,
	TransactionWithPageInfoOutputDto,
} from "@libs/contracts/index";
import { JwtAccessAuthGuard } from "@gateway/core/guards/jwt-access-auth.guard";
import { GetPlansSwagger } from "@gateway/core/decorators/swagger/payments/get-plans.decorator";
import { CreatePlanSwagger } from "@gateway/core/decorators/swagger/payments/create-plan.decorator";
import { DeletePlanSwagger } from "@gateway/core/decorators/swagger/payments/delete-plan.decorator";
import { ApiTags } from "@nestjs/swagger";
import { ApiTagsNames } from "@libs/constants/index";
import { WebhookStripeSwagger } from "@gateway/core/decorators/swagger/payments/webhook-stripe.decorator";
import { PaymentInputDto } from "@libs/contracts/payments-contracts/input/payment.input.dto";
import { GetTransactionsSwagger } from "@gateway/core/decorators/swagger/payments/get-transactions.decorator";
import { MakePaymentSwagger } from "@gateway/core/decorators/swagger/payments/make-payment.decorator";
import { ExtractUserFromRequest } from "@gateway/core/decorators/param/extract-user-from-request";
import { GetCurrentSubscriptionSwagger } from "@gateway/core/decorators/swagger/payments/get-current-subscription.decorator";
import { AutoRenewalSubscriptionSwagger } from "@gateway/core/decorators/swagger/payments/auto-renewal-subscription.decorator";
import { RenewalInputDto } from "@libs/contracts/payments-contracts/input/renewal.input.dto";
import { WebhookPayPalSwagger } from "@gateway/core/decorators/swagger/payments/webhook-paypal.decorator";
import { PlanOutputDto } from "@libs/contracts/index";
@ApiTags(ApiTagsNames.PAYMENTS)
@Controller("payments")
export class PaymentsClientController {
	constructor(private readonly paymentsClientService: PaymentsClientService) {}

	@GetPlansSwagger()
	@UseGuards(JwtAccessAuthGuard)
	@Get("plans")
	@HttpCode(HttpStatus.OK)
	async getPlans(): Promise<PlanOutputDto[]> {
		return this.paymentsClientService.getPlans();
	}

	@CreatePlanSwagger()
	@UseGuards(JwtAccessAuthGuard)
	@Post("plans")
	@HttpCode(HttpStatus.CREATED)
	async createPlan(@Body() plan: PlanInputDto): Promise<string> {
		return this.paymentsClientService.createPlan(plan);
	}

	@DeletePlanSwagger()
	@UseGuards(JwtAccessAuthGuard)
	@Delete("plans/:id")
	@HttpCode(HttpStatus.NO_CONTENT)
	async deletePlan(@Param("id") id: string): Promise<void> {
		await this.paymentsClientService.deletePlan(id);
		return;
	}

	@WebhookStripeSwagger()
	@Post("webhook/stripe")
	@HttpCode(HttpStatus.OK)
	async webhookStripe(@RawBody() rawBody: any, @Headers("stripe-signature") stripeSignature: string): Promise<void> {
		await this.paymentsClientService.webhookStripe(rawBody, stripeSignature);
		return;
	}

	@WebhookPayPalSwagger()
	@Post("webhook/paypal")
	@HttpCode(HttpStatus.OK)
	async webhookPayPal(@Body() data: any): Promise<void> {
		await this.paymentsClientService.webhookPayPal(data);
		return;
	}

	@MakePaymentSwagger()
	@UseGuards(JwtAccessAuthGuard)
	@Post("make-payment")
	@HttpCode(HttpStatus.CREATED)
	async makePayment(@Body() payment: PaymentInputDto, @ExtractUserFromRequest() user: PayloadFromRequestDto): Promise<PaymentOutputDto> {
		return this.paymentsClientService.makePayment(payment, user.userId);
	}

	@GetTransactionsSwagger()
	@UseGuards(JwtAccessAuthGuard)
	@Get("transactions")
	@HttpCode(HttpStatus.OK)
	async getTransactions(
		@ExtractUserFromRequest() user: PayloadFromRequestDto,
		@Query() query: PaginationWithSortQueryDto,
	): Promise<TransactionWithPageInfoOutputDto> {
		return this.paymentsClientService.getTransactions(user.userId, query);
	}

	@GetCurrentSubscriptionSwagger()
	@UseGuards(JwtAccessAuthGuard)
	@Get("current-subscription")
	@HttpCode(HttpStatus.OK)
	async getCurrentSubscription(@ExtractUserFromRequest() user: PayloadFromRequestDto): Promise<SubscriptionOutputDto> {
		return this.paymentsClientService.getCurrentSubscription(user.userId);
	}

	@AutoRenewalSubscriptionSwagger()
	@UseGuards(JwtAccessAuthGuard)
	@Post("auto-renewal")
	@HttpCode(HttpStatus.NO_CONTENT)
	async autoRenewalSubscription(@ExtractUserFromRequest() user: PayloadFromRequestDto, @Body() body: RenewalInputDto): Promise<void> {
		await this.paymentsClientService.autoRenewalSubscription(user.userId, body.isAutoRenewal);
		return;
	}
}

import { PaymentsMessages } from "@libs/constants/payment-messages";
import { MeUserViewDto, PaginationWithSortQueryDto, PaymentInputDto, PaymentOutputDto, TransactionWithPageInfoOutputDto } from "@libs/contracts/index";
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { TransactionService } from "@payments/modules/transaction/transaction.service";
import { ITransactionQueryRepository } from "./transaction.interface";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";
import { IPlanQueryRepository } from "../plan/plan.interface";

@Controller()
export class TransactionController {
	constructor(
		private readonly transactionService: TransactionService,
		private readonly transactionQueryRepository: ITransactionQueryRepository,
		private readonly planQueryRepository: IPlanQueryRepository,
	) {}

	@MessagePattern({ cmd: PaymentsMessages.MAKE_PAYMENT })
	async makePayment(@Payload() dto: { payment: PaymentInputDto; user: MeUserViewDto }): Promise<PaymentOutputDto> {
		// проверяем существование плана
		const plan = await this.planQueryRepository.findRawPlanById(+dto.payment.planId);
		if (!plan) {
			throw new NotFoundRpcException(`Plan with id ${dto.payment.planId} not found`);
		}
		return this.transactionService.makePayment(dto.user, dto.payment, plan);
	}

	@MessagePattern({ cmd: PaymentsMessages.GET_TRANSACTIONS })
	async getTransactions(@Payload() dto: { userId: string; query: PaginationWithSortQueryDto }): Promise<TransactionWithPageInfoOutputDto> {
		return this.transactionQueryRepository.getTransactions(dto.userId, dto.query);
	}
}

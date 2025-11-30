import { PaymentsMessages } from "@libs/constants/payment-messages";
import { MeUserViewDto, PaginationWithSortQueryDto, PaymentInputDto, PaymentOutputDto, TransactionWithPageInfoOutputDto } from "@libs/contracts/index";
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { TransactionService } from "@payments/modules/transaction/transaction.service";
import { ITransactionQueryRepository } from "@payments/modules/transaction/transaction.interface";
import { NotFoundRpcException } from "@libs/exeption/rpc-exeption";
import { IPlanQueryRepository } from "@payments/modules/plan/plan.interface";

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

	@MessagePattern({ cmd: PaymentsMessages.GET_TRANSACTIONS_BY_USER_ID })
	async getTransactionsByUserId(@Payload() dto: { userId: string; query: PaginationWithSortQueryDto }): Promise<TransactionWithPageInfoOutputDto> {
		const transactions = await this.transactionQueryRepository.getTransactionsByUserId(dto.userId, dto.query);
		return transactions;
	}

	@MessagePattern({ cmd: PaymentsMessages.GET_TRANSACTIONS_BY_USER_IDS })
	async getTransactionsByUserIds(@Payload() dto: { userIds: string[]; query: PaginationWithSortQueryDto }): Promise<TransactionWithPageInfoOutputDto> {
		return this.transactionQueryRepository.getTransactionsByUserIds(dto.userIds, dto.query);
	}

	@MessagePattern({ cmd: PaymentsMessages.GET_TRANSACTIONS })
	async getTransactions(@Payload() dto: { query: PaginationWithSortQueryDto }): Promise<TransactionWithPageInfoOutputDto> {
		return this.transactionQueryRepository.getTransactions(dto.query);
	}
}

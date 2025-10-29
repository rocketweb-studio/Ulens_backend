import { Query, Resolver, Args } from "@nestjs/graphql";
import { GetPaymentsInput } from "@gateway/microservices/payments/payments_gql/inputs/get-payments.input";
import { GqlJwtAuthGuard } from "@gateway/core/guards/gql-jwt-auth.guard";
import { UseGuards } from "@nestjs/common";
import { PaymentsClientService } from "@gateway/microservices/payments/payments-client.service";
import { TransactionsResponse } from "@gateway/microservices/payments/payments_gql/models/payment.model";

@Resolver("Payments")
export class PaymentsGqlResolver {
	constructor(private readonly paymentsClientService: PaymentsClientService) {}

	@UseGuards(GqlJwtAuthGuard)
	@Query(() => TransactionsResponse, { name: "getPayments" })
	async getUsers(@Args("input") input: GetPaymentsInput) {
		const userId = input.userId;
		const query = {
			pageNumber: input.pageNumber,
			pageSize: input.pageSize,
			sortDirection: input.sortDirection,
			sortBy: input.sortBy,
		};
		return this.paymentsClientService.getTransactions(userId, query);
	}
}

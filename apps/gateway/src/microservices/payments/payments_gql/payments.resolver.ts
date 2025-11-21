import { Query, Resolver, Args } from "@nestjs/graphql";
import { GetPaymentsInput, GetUserPaymentsInput } from "@gateway/microservices/payments/payments_gql/inputs/get-payments.input";
import { GqlJwtAuthGuard } from "@gateway/core/guards/gql-jwt-auth.guard";
import { UseGuards } from "@nestjs/common";
import { TransactionsResponse, TransactionsResponseForAdmin } from "@gateway/microservices/payments/payments_gql/models/payment.model";
import { ProfileAuthClientService } from "@gateway/microservices/auth/profile/profile-auth-clien.service";
import { FilesClientService } from "@gateway/microservices/files/files-client.service";
import { AvatarImagesOutputDto, ProfileOutputForMapDto } from "@libs/contracts/index";
import { PaymentsClientService } from "../payments-client.service";

@Resolver("Payments")
export class PaymentsGqlResolver {
	constructor(
		private readonly profileClientService: ProfileAuthClientService,
		private readonly filesClientService: FilesClientService,
		private readonly paymentsClientService: PaymentsClientService,
	) {}

	@UseGuards(GqlJwtAuthGuard)
	@Query(() => TransactionsResponseForAdmin, { name: "getPaymentsForAdmin" })
	async getPaymentsForAdmin(@Args("input") input: GetPaymentsInput) {
		const query = {
			pageNumber: input.pageNumber,
			pageSize: input.pageSize,
			sortDirection: input.sortDirection,
			sortBy: input.sortBy,
		};

		if (input.search) {
			return await this.getPaymentsForAdminByUserName(input.search, query);
		}
		return await this.getPaymentsForAdminWithoutUserName(query);
	}

	@UseGuards(GqlJwtAuthGuard)
	@Query(() => TransactionsResponse, { name: "getUserPayments" })
	async getUserPayments(@Args("input") input: GetUserPaymentsInput) {
		const userId = input.userId;
		const query = {
			pageNumber: input.pageNumber,
			pageSize: input.pageSize,
			sortDirection: input.sortDirection,
			sortBy: input.sortBy,
		};
		return this.paymentsClientService.getTransactionsByUserId(userId, query);
	}

	private async getPaymentsForAdminByUserName(userName: string, query: Omit<GetPaymentsInput, "search">): Promise<TransactionsResponseForAdmin> {
		const matchedProfiles = await this.profileClientService.getProfilesByUserName(userName);
		const userIds = matchedProfiles.map((profile) => profile.id);
		const profilesAvatars: { userId: string; avatars: AvatarImagesOutputDto }[] = await this.filesClientService.getAvatarsByUserIds(userIds);
		const payments = await this.paymentsClientService.getTransactionsByUserIds(userIds, query);
		const profilesMap = new Map<string, ProfileOutputForMapDto>(matchedProfiles.map((profile) => [profile.id, profile]));

		return {
			totalCount: payments.totalCount,
			page: payments.page,
			pageSize: payments.pageSize,
			items: payments.items.map((payment) => ({
				...payment,
				user: {
					id: payment.userId,
					userName: profilesMap.get(payment.userId)?.userName || null,
					firstName: profilesMap.get(payment.userId)?.firstName || null,
					lastName: profilesMap.get(payment.userId)?.lastName || null,
					avatar: profilesAvatars.find((avatar) => avatar.userId === payment.userId)?.avatars.small?.url || null,
				},
			})),
		};
	}

	private async getPaymentsForAdminWithoutUserName(query: Omit<GetPaymentsInput, "search">): Promise<TransactionsResponseForAdmin> {
		const payments = await this.paymentsClientService.getTransactions(query);
		const paymentsUserIds = payments.items.map((payment) => payment.userId);
		const profiles: ProfileOutputForMapDto[] = await this.profileClientService.getProfiles(paymentsUserIds);
		const profilesAvatars: { userId: string; avatars: AvatarImagesOutputDto }[] = await this.filesClientService.getAvatarsByUserIds(paymentsUserIds);
		const profilesMap = new Map<string, ProfileOutputForMapDto>(profiles.map((profile) => [profile.id, profile]));

		return {
			totalCount: payments.totalCount,
			page: payments.page,
			pageSize: payments.pageSize,
			items: payments.items.map((payment) => ({
				...payment,
				createdAt: payment.createdAt.toString(),
				user: {
					id: payment.userId,
					userName: profilesMap.get(payment.userId)?.userName || "",
					firstName: profilesMap.get(payment.userId)?.firstName || "",
					lastName: profilesMap.get(payment.userId)?.lastName || "",
					avatar: profilesAvatars.find((avatar) => avatar.userId === payment.userId)?.avatars.small?.url || null,
				},
			})),
		};
	}
}

import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { SortDirection } from "@libs/constants/sort-direction";
import { SortableTransactionFields } from "@libs/contracts/payments-contracts/output/transaction.output.dto";

registerEnumType(SortDirection, {
	name: "SortDirection",
});

registerEnumType(SortableTransactionFields, {
	name: "SortableTransactionFields",
});

@InputType()
export class GetPaymentsInput {
	@Field(() => String, { nullable: true, defaultValue: "" })
	search: string = "";

	@Field(() => Number, { nullable: true, defaultValue: 1 })
	pageNumber: number = 1;

	@Field(() => Number, { nullable: true, defaultValue: 6 })
	pageSize: number = 6;

	@Field(() => SortDirection, { nullable: true, defaultValue: SortDirection.DESC })
	sortDirection: SortDirection = SortDirection.DESC;

	@Field(() => SortableTransactionFields, { nullable: true, defaultValue: SortableTransactionFields.CREATED_AT })
	sortBy: SortableTransactionFields = SortableTransactionFields.CREATED_AT;
}

@InputType()
export class GetUserPaymentsInput {
	@Field(() => String)
	userId: string;

	@Field(() => Number, { nullable: true, defaultValue: 1 })
	pageNumber: number = 1;

	@Field(() => Number, { nullable: true, defaultValue: 6 })
	pageSize: number = 6;

	@Field(() => SortDirection, { nullable: true, defaultValue: SortDirection.DESC })
	sortDirection: SortDirection = SortDirection.DESC;

	@Field(() => SortableTransactionFields, { nullable: true, defaultValue: SortableTransactionFields.CREATED_AT })
	sortBy: SortableTransactionFields = SortableTransactionFields.CREATED_AT;
}

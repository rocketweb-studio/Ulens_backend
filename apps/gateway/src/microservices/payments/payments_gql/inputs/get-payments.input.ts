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
	@Field(() => String)
	userId: string;

	@Field(() => Number, { nullable: true, defaultValue: 1 })
	pageNumber: number;

	@Field(() => Number, { nullable: true, defaultValue: 8 })
	pageSize: number;

	@Field(() => SortDirection, { nullable: true, defaultValue: SortDirection.DESC })
	sortDirection: SortDirection;

	@Field(() => SortableTransactionFields, { nullable: true, defaultValue: SortableTransactionFields.CREATED_AT })
	sortBy: SortableTransactionFields;
}

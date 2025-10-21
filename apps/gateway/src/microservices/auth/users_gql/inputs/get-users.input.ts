import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { FilterByStatus, SortabeFieldsForUsers } from "@libs/constants/auth.constants";
import { SortDirection } from "@libs/constants/sort-direction";

registerEnumType(FilterByStatus, {
	name: "FilterByStatus",
});

registerEnumType(SortDirection, {
	name: "SortDirection",
});

registerEnumType(SortabeFieldsForUsers, {
	name: "SortabeFieldsForUsers",
});

@InputType()
export class GetUsersInput {
	@Field(() => String, { nullable: true, defaultValue: "" })
	search: string;

	@Field(() => FilterByStatus, { nullable: true, defaultValue: FilterByStatus.ALL })
	filterByStatus: FilterByStatus;

	@Field(() => Number, { nullable: true, defaultValue: 1 })
	pageNumber: number;

	@Field(() => Number, { nullable: true, defaultValue: 8 })
	pageSize: number;

	@Field(() => SortDirection, { nullable: true, defaultValue: SortDirection.DESC })
	sortDirection: SortDirection;

	@Field(() => SortabeFieldsForUsers, { nullable: true, defaultValue: SortabeFieldsForUsers.CREATED_AT })
	sortBy: SortabeFieldsForUsers;
}

import { Field, InputType } from "@nestjs/graphql";

enum FilterByStatus {
	ACTIVE = "active",
	BLOCKED = "blocked",
	ALL = "all",
}

@InputType()
export class GetUsersInput {
	@Field(() => String)
	search: string;

	@Field(() => String)
	filterByStatus: string;

	@Field(() => Number)
	page: number;

	@Field(() => Number)
	perPage: number;
}

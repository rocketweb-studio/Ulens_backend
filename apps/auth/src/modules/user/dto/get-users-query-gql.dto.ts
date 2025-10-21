import { FilterByStatus, SortabeFieldsForUsers } from "@libs/constants/auth.constants";
import { SortDirection } from "@libs/constants/sort-direction";

export class GetUsersQueryGqlDto {
	search: string;
	filterByStatus: FilterByStatus;
	pageNumber: number;
	pageSize: number;
	sortDirection: SortDirection;
	sortBy: SortabeFieldsForUsers;
}

import { UserPostsPageDto } from "@libs/contracts/index";

export const toPostIdArray = (dto: Pick<UserPostsPageDto, "items">): string[] => dto.items.map(({ id }) => id);

import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserModel {
	@Field(() => String)
	id: string;

	@Field(() => String, { nullable: true })
	userName: string;

	@Field(() => String)
	createdAt: string;

	@Field(() => Boolean)
	isBlocked: boolean;
}

@ObjectType()
export class UsersResponse {
	@Field(() => Number)
	totalCount: number;

	@Field(() => Number)
	page: number;

	@Field(() => Number)
	pageSize: number;

	@Field(() => [UserModel])
	items: UserModel[];
}

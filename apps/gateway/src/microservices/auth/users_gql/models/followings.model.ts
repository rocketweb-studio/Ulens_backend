import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class FollowingModel {
	@Field(() => String)
	id: string;
	@Field(() => String)
	userName: string;
	@Field(() => String)
	createdAt: string;
	@Field(() => String, { nullable: true })
	firstName: string | null;
	@Field(() => String, { nullable: true })
	lastName: string;
	@Field(() => String, { nullable: true })
	city: string | null;
	@Field(() => String, { nullable: true })
	country: string | null;
	@Field(() => String, { nullable: true })
	dateOfBirth: string | null;
	@Field(() => String, { nullable: true })
	aboutMe: string | null;
}

@ObjectType()
export class FollowingsResponse {
	@Field(() => [FollowingModel])
	items: FollowingModel[];
	@Field(() => Number)
	totalCount: number;
	@Field(() => Number)
	pageSize: number;
	@Field(() => Number)
	pageNumber: number;
}

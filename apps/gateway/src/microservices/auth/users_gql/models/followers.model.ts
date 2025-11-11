import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class FollowerModel {
	@Field(() => String)
	id: string;
	@Field(() => String)
	userName: string;
	@Field(() => String)
	createdAt: string;
	@Field(() => String, { nullable: true })
	firstName: string;
	@Field(() => String, { nullable: true })
	lastName: string;
	@Field(() => String, { nullable: true })
	city: string;
	@Field(() => String, { nullable: true })
	country: string;
	@Field(() => String, { nullable: true })
	dateOfBirth: string;
	@Field(() => String, { nullable: true })
	aboutMe: string;
}

@ObjectType()
export class FollowersResponse {
	@Field(() => [FollowerModel])
	items: FollowerModel[];
	@Field(() => Number)
	totalCount: number;
	@Field(() => Number)
	pageSize: number;
	@Field(() => Number)
	pageNumber: number;
}

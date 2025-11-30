import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class GetFollowInput {
	@Field(() => String)
	userId: string;

	@Field(() => Number, { nullable: true, defaultValue: 1 })
	pageNumber: number = 1;

	@Field(() => Number, { nullable: true, defaultValue: 10 })
	pageSize: number = 10;
}

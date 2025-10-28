import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetAdminPostsInput {
	@Field(() => String, { nullable: true, defaultValue: null })
	endCursorPostId: string;

	@Field(() => Number, { nullable: true, defaultValue: 10 })
	pageSize: number;
}

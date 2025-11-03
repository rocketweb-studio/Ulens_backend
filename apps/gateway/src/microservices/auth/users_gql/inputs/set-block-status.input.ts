import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SetBlockStatusForUserInput {
	@Field(() => String)
	userId: string;

	@Field(() => Boolean)
	isBlocked: boolean;

	@Field(() => String, { nullable: true })
	reason?: string;
}

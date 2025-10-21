import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PostModel {
	@Field(() => ID)
	id: string;
}

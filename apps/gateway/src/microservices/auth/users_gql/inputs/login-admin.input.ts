import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class LoginAdminInput {
	@Field(() => String)
	email: string;

	@Field(() => String)
	password: string;
}

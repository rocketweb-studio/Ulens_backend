import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class LoginAdminModel {
	@Field(() => String)
	adminAccessToken: string;
}

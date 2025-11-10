import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TransactionModel {
	@Field(() => Number)
	id: number;

	@Field(() => Number)
	amount: number;

	@Field(() => String)
	currency: string;

	@Field(() => String)
	status: string;

	@Field(() => String)
	provider: string;

	@Field(() => String)
	expiresAt: string;

	@Field(() => String)
	interval: string;
}

@ObjectType()
export class TransactionsResponse {
	@Field(() => Number)
	totalCount: number;

	@Field(() => Number)
	page: number;

	@Field(() => Number)
	pageSize: number;

	@Field(() => [TransactionModel])
	items: TransactionModel[];
}

//* for admin graphql

@ObjectType()
export class UserModelForAdmin {
	@Field(() => String)
	id: string;

	@Field(() => String)
	firstName: string;

	@Field(() => String)
	lastName: string;

	@Field(() => String)
	avatar: string | null;

	@Field(() => String)
	userName: string;
}

@ObjectType()
export class TransactionModelForAdmin {
	@Field(() => Number)
	id: number;

	@Field(() => Number)
	amount: number;

	@Field(() => String)
	currency: string;

	@Field(() => String)
	status: string;

	@Field(() => String)
	provider: string;

	@Field(() => String)
	createdAt: string;

	@Field(() => String)
	interval: string;

	@Field(() => UserModelForAdmin)
	user: UserModelForAdmin;
}

@ObjectType()
export class TransactionsResponseForAdmin {
	@Field(() => Number)
	totalCount: number;

	@Field(() => Number)
	page: number;

	@Field(() => Number)
	pageSize: number;

	@Field(() => [TransactionModelForAdmin])
	items: TransactionModelForAdmin[];
}

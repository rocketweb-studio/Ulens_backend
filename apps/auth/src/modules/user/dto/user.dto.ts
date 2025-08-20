import { BaseUserView } from "@libs/contracts/index";
import { UUID } from "crypto";

export class UserWithPassword extends BaseUserView {
	passwordHash: string;
	confirmationCodeConfirmed: boolean;

	constructor(model: any) {
		super(model);
		this.passwordHash = model.passwordHash;
		this.confirmationCodeConfirmed = model.confirmationCodeConfirmed;
	}

	static mapToView(user: any): UserWithPassword {
		return new UserWithPassword(user);
	}
}

export class UserWithRefreshToken extends BaseUserView {
	refreshToken: string;

	constructor(model: any) {
		super(model);
		this.refreshToken = model.refreshToken;
	}

	static mapToView(user: any): UserWithRefreshToken {
		return new UserWithRefreshToken(user);
	}
}

export class UserWithConfirmationCode extends BaseUserView {
	confirmationCode: string;

	constructor(model: any) {
		super(model);
		this.confirmationCode = model.confirmationCode;
	}

	static mapToView(user: any): UserWithConfirmationCode {
		return new UserWithConfirmationCode(user);
	}
}

export class UserWithPayloadFromJwt {
	refreshToken: string;
	userId: UUID;
	deviceId: UUID;
}

export class UserDbInputDto {
	id: string;
	userName: string;
	passwordHash: string;
	email: string;
	confirmationCode: string;
	confirmationCodeExpDate: string;
	confirmationCodeConfirmed: boolean;
}

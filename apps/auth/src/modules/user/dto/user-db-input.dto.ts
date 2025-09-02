export class UserDbInputDto {
	passwordHash: string;
	userName: string;
	email: string;
	confirmationCode: string;
	confirmationCodeExpDate: string;
	confirmationCodeConfirmed: boolean;
}

export class NewPasswordInputRepoDto {
	recoveryCode: string | null;
	recoveryCodeExpDate: string | null;
	passwordHash: string;
}

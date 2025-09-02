export type UserOutputRepoDto = {
	id: string;
	email: string;
	passwordHash: string | null;
	profile: {
		userName: string | null;
	};
	confirmationCode: string | null;
	confirmationCodeExpDate: Date | null;
	confirmationCodeConfirmed: boolean;
	recoveryCode: string | null;
	recoveryCodeExpDate: Date | null;
	googleUserId: string | null;
	githubUserId: string | null;
};

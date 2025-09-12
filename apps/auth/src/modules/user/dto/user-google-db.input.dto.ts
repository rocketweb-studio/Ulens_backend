export class UserOauthDbInputDto {
	userName: string;
	googleUserId?: string;
	githubUserId?: string;
	email: string;
	confirmationCodeConfirmed: boolean;
}

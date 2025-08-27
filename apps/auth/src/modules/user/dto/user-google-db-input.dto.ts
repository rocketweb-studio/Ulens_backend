export class UserOauthDbInputDto {
	id: string;
	userName: string;
	googleUserId?: string;
	githubUserId?: string;
	email: string;
	confirmationCodeConfirmed: boolean;
}

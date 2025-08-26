export type CreateOauthUserDto = {
	userName: string;
	email: string;
	accessToken: string;
	refreshToken: string;
	providerProfileId: string;
};

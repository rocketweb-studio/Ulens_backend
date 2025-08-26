export enum AuthMessages {
	GET_USERS = "get_users",
	CREATE_USER = "create_user",
	REGISTRATION = "registration",
	REGISTRATION_OAUTH2 = "registration_oauth2",
	EMAIL_CONFIRMATION = "email_confirmation",
	RESEND_EMAIL = "resend_email",
	PASSWORD_RECOVERY = "password_recovery",
	CHECK_RECOVERY_CODE = "check_recovery_code",
	NEW_PASSWORD = "new_password",
	CLEAR_AUTH_DATABASE = "clear_auth_database",
	LOGIN = "login",
	REFRESH_TOKENS = "refresh_tokens",
	LOGOUT = "logout",
	ME = "me",
}

export enum Oauth2Providers {
	GOOGLE = "google",
	GITHUB = "github",
}

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
	GET_PROFILE_FOR_POSTS = "get_profile_for_posts",
	GET_PROFILE = "get_profile",
	UPDATE_PROFILE = "update_profile",
	DELETE_PROFILE = "delete_profile",
	GET_USER_CONFIRMATION_BY_EMAIL = "get_user_confirmation_by_email",
	GET_SESSIONS = "get_sessions",
	LOGOUT_SESSION = "logout_session",
	LOGOUT_OTHER_SESSIONS = "logout_other_sessions",
}

export enum Oauth2Providers {
	GOOGLE = "google",
	GITHUB = "github",
}

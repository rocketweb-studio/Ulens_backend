export enum RouterPrefix {
	API_V1 = "api/v1",
}

export enum AuthRouterPaths {
	AUTH = "auth",
	SUBSCRIPTIONS = "subscriptions",
	REGISTRATION = "registration",
	REGISTRATION_CONFIRMATION = "registration-confirmation",
	REGISTRATION_EMAIL_RESENDING = "registration-email-resending",
	PASSWORD_RECOVERY = "password-recovery",
	CHECK_RECOVERY_CODE = "check-recovery-code",
	NEW_PASSWORD = "new-password",
	LOGIN = "login",
	REFRESH_TOKENS = "refresh",
	LOGOUT = "logout",
	ME = "me",
	GOOGLE_LOGIN = "google-login",
	GOOGLE_CALLBACK = "google-callback",
	GITHUB_LOGIN = "github-login",
	GITHUB_CALLBACK = "github-callback",
	FILES = "files",
}

export enum UsersRouterPaths {
	USERS = "users",
	USERS_COUNT = "users-count",
	FOLLOW = "follow",
	UNFOLLOW = "unfollow",
	FOLLOWERS = "followers",
	FOLLOWINGS = "followings",
}

export enum ProfileRouterPaths {
	PROFILE = "profile",
	AVATAR = "avatar",
}

export enum SessionRouterPaths {
	SESSIONS = "sessions",
}

export enum MainRouterPaths {
	COMMENTS = "comments",
	POSTS = "posts",
	IMAGES = ":postId/images",
	LATEST_POSTS = "latest",
	FOLLOWINGS = "followings",
	LIKE = "like",
}

export enum RouteParams {
	POST_ID = ":postId",
	USER_ID = ":userId",
}

export enum ApiTagsNames {
	AUTH = "Auth",
	USERS = "Users",
	PROFILE = "Profile",
	OAuth2 = "OAuth2",
	FILES = "Files",
	POSTS = "Posts",
	PAYMENTS = "Payments",
	SESSIONS = "Sessions",
	NOTIFICATIONS = "Notifications",
	COMMENTS = "Comments",
	MESSENGER = "Messenger",
}

export enum MessengerRouterPaths {
	MESSENGER = "messenger",
	ROOMS = "rooms",
	MESSAGES = "rooms/:roomId/messages",
}

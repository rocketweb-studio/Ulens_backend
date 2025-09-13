export const RmqTokens = {
	CONNECTION: "RMQ_CONNECTION",
	CHANNEL: "RMQ_CHANNEL",
} as const;

export const EnvKeys = {
	RMQ_URL: "RMQ_URL",
} as const;

export const Exchanges = {
	APP_EVENTS: "app.events",
	DLX: "app.dlx",
} as const;

export const ExchangeTypes = {
	TOPIC: "topic",
} as const;

export const RoutingKeys = {
	AUTH_USER_REGISTERED_V1: "auth.user.registered.v1",
	AUTH_USER_REGISTERED_DLQ: "auth.user.registered.q.dlq",
} as const;

export const Queues = {
	AUTH_USER_REGISTERED: "auth.user.registered.q",
	AUTH_USER_REGISTERED_RETRY_1M: "auth.user.registered.q.retry.1m",
	AUTH_USER_REGISTERED_DLQ: "auth.user.registered.q.dlq",
} as const;

export const HeaderKeys = {
	RETRIES: "x-retries",
} as const;

export const ContentTypes = {
	JSON: "application/json",
} as const;

export const RmqPolicy = {
	PREFETCH: 50,
	RETRY_TTL_MS: 60_000,
	MAX_RETRIES: 3,
} as const;

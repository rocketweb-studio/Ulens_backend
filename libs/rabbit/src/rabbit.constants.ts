export const RMQ_CHANNEL = "RMQ_CHANNEL";
export const RMQ_CONNECTION = "RMQ_CONNECTION";
export const RMQ_EVENT_BUS = "RMQ_EVENT_BUS";

export enum RabbitExchanges {
	APP_EVENTS = "app.events",
	APP_DLX = "app.dlx",
}

export enum RabbitQueues {
	NOTIFICATIONS_NOTIFICATION_SEND_Q = "notifications.notification.send.q",
}

export enum RabbitDLX {
	APP_DLX = "app.dlx",
}

export enum RabbitEventSources {
	PAYMENTS_SERVICE = "payments-service",
	AUTH_SERVICE = "auth-service",
	NOTIFICATIONS_SERVICE = "notifications-service",
}

export enum RabbitEvents {
	NOTIFICATION_SEND = "notification.send",
	PAYMENT_SUCCEEDED = "payment.succeeded",
	AUTH_PREMIUM_ACTIVATED = "auth.premium.activated",
}

export enum RabbitMainQueues {
	NOTIFICATIONS_NOTIFICATION_SEND_Q = "notifications.notification.send.q",
	PAYMENTS_AUTH_PREMIUM_ACTIVATED_Q = "payments.auth.premium.activated.q",
	AUTH_PAYMENT_SUCCEEDED_Q = "auth.payment.succeeded.q",
}

export const RabbitRetryTtlMs = 60_000;

export class QueueConfig {
	baseQueue: string;
	exchange: string;
	routingKey: string;
	retryTtlMs?: number;
}

export const APPLICATION_JSON = "application/json";

export enum OutboxAggregateType {
	TRANSACTION = "transaction",
	NOTIFICATION = "notification",
	PREMIUM_ACTIVATED = "premium.activated",
}

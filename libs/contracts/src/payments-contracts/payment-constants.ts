export enum CurrencyEnum {
	USD = "usd",
	EUR = "eur",
	BYN = "byn",
	RUB = "rub",
}

export enum PaymentIntervalEnum {
	DAY = "day",
	WEEK = "week",
	MONTH = "month",
	YEAR = "year",
}

export enum TransactionStatusEnum {
	PENDING = "PENDING",
	SUCCESS = "SUCCESS",
	FAILED = "FAILED",
	EXPIRED = "EXPIRED",
}

export enum PaymentProvidersEnum {
	STRIPE = "STRIPE",
	PAYPAL = "PAYPAL",
}

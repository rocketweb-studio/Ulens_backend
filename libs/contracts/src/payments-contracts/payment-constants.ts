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

export const planIntervalsInDays = {
	[PaymentIntervalEnum.MONTH]: 30,
	[PaymentIntervalEnum.WEEK]: 7,
	[PaymentIntervalEnum.DAY]: 1,
	[PaymentIntervalEnum.YEAR]: 365,
};

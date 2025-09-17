export interface PayPalOptions {
	clientId: string;
	clientSecret: string;
	isSandbox: boolean;
	timeout?: number;
	logLevel?: string;
}

export const PayPalOptionsSymbol = Symbol("PayPalOptions");

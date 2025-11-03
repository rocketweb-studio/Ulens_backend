import Stripe from "stripe";

export const StripeOptionsSymbol = Symbol("StripeOptionsSymbol");

export interface StripeOptions {
	apiKey: string;
	config: Stripe.StripeConfig;
}

export interface StripeAsyncOptions {
	useFactory: (...args: any[]) => Promise<StripeOptions> | StripeOptions;
	inject?: any[];
	imports?: any[];
}

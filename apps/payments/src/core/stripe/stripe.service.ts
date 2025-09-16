import { Inject, Injectable } from "@nestjs/common";
import Stripe from "stripe";
import { StripeOptionsSymbol } from "./types/stripe.types";
import { StripeOptions } from "./types/stripe.types";

@Injectable()
export class StripeService extends Stripe {
	constructor(@Inject(StripeOptionsSymbol) private readonly options: StripeOptions) {
		super(options.apiKey, options.config);
	}
}

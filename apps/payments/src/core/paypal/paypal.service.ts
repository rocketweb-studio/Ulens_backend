import { Inject, Injectable } from "@nestjs/common";
import { PayPalOptionsSymbol, PayPalOptions } from "./types/paypal.types";
import { Client, Environment, LogLevel } from "@paypal/paypal-server-sdk";

@Injectable()
export class PayPalService {
	public readonly client: Client;

	constructor(@Inject(PayPalOptionsSymbol) private readonly options: PayPalOptions) {
		this.client = new Client({
			clientCredentialsAuthCredentials: {
				oAuthClientId: options.clientId,
				oAuthClientSecret: options.clientSecret,
			},
			timeout: options.timeout ?? 0,
			environment: options.isSandbox ? Environment.Sandbox : Environment.Production,
			logging: {
				logLevel: LogLevel[options.logLevel ?? "Info"],
				logRequest: { logBody: true },
				logResponse: { logHeaders: true },
			},
		});
	}
}

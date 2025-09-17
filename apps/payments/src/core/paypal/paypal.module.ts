import { DynamicModule, Global, Module } from "@nestjs/common";
import { PayPalService } from "./paypal.service";
import { PayPalOptions, PayPalOptionsSymbol } from "./types/paypal.types";
import { PayPalConfig } from "./paypal.config";

@Global()
@Module({})
export class PayPalModule {
	static forRoot(options: PayPalOptions): DynamicModule {
		return {
			module: PayPalModule,
			providers: [{ provide: PayPalOptionsSymbol, useValue: options }, PayPalService],
			exports: [PayPalService, PayPalConfig],
		};
	}

	static forRootAsync(options: { useFactory: (...args: any[]) => PayPalOptions | Promise<PayPalOptions>; inject?: any[]; imports?: any[] }): DynamicModule {
		return {
			module: PayPalModule,
			imports: options.imports || [],
			providers: [
				{
					provide: PayPalOptionsSymbol,
					useFactory: options.useFactory,
					inject: options.inject || [],
				},
				PayPalService,
				PayPalConfig,
			],
			exports: [PayPalService, PayPalConfig],
		};
	}
}

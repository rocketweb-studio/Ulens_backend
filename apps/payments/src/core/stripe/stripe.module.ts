import { DynamicModule, Global, Module } from "@nestjs/common";
import { StripeConfig } from "./stripe.config";
import { StripeAsyncOptions, StripeOptions, StripeOptionsSymbol } from "./types/stripe.types";
import { StripeService } from "./stripe.service";

// модуль для Stripe, чтобы не использовать сторонние библиотеки
@Global()
@Module({})
export class StripeModule {
	static forRoot(options: StripeOptions): DynamicModule {
		return {
			module: StripeModule,
			providers: [{ provide: StripeOptionsSymbol, useValue: options }, StripeService],
			exports: [StripeService, StripeConfig],
		};
	}

	static forRootAsync(options: StripeAsyncOptions): DynamicModule {
		return {
			module: StripeModule,
			imports: options.imports || [],
			providers: [
				{
					provide: StripeOptionsSymbol,
					useFactory: options.useFactory,
					inject: options.inject || [],
				},
				StripeService,
				StripeConfig,
			],
			exports: [StripeService, StripeConfig],
		};
	}
}

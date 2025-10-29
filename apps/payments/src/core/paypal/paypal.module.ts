import { Global, Module } from "@nestjs/common";
import { PayPalService } from "@payments/core/paypal/paypal.service";
import { PayPalConfig } from "@payments/core/paypal/paypal.config";

@Global()
@Module({
	imports: [],
	controllers: [],
	providers: [PayPalService, PayPalConfig],
	exports: [PayPalService],
})
export class PayPalModule {}

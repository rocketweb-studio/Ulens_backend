import { Global, Module } from "@nestjs/common";
import { PayPalService } from "./paypal.service";
import { PayPalConfig } from "./paypal.config";

@Global()
@Module({
	imports: [],
	controllers: [],
	providers: [PayPalService, PayPalConfig],
	exports: [PayPalService],
})
export class PayPalModule {}

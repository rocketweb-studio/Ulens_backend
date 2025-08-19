import { DynamicModule, Module } from "@nestjs/common";
import { PaymentsController } from "@/payments.controller";
import { PaymentsService } from "@/payments.service";
import { CoreEnvConfig } from "@/core/core-env.config";
import { CoreModule } from "./core/core.module";

@Module({
	imports: [CoreModule],
	controllers: [PaymentsController],
	providers: [PaymentsService],
})
export class PaymentsModule {
	static forRoot(config: CoreEnvConfig): DynamicModule {
		return {
			module: PaymentsModule,
			providers: [
				{
					provide: CoreEnvConfig,
					useValue: config,
				},
			],
		};
	}
}

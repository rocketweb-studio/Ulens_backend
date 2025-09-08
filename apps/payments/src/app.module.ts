import { DynamicModule, Module } from "@nestjs/common";
import { PaymentsController } from "@payments/payments.controller";
import { CoreEnvConfig } from "@payments/core/core-env.config";
import { CoreModule } from "./core/core.module";
import { RabbitModule } from "@libs/rabbit/index";
@Module({
	imports: [CoreModule, RabbitModule],
	controllers: [PaymentsController],
	providers: [],
})
export class AppModule {
	static forRoot(config: CoreEnvConfig): DynamicModule {
		return {
			module: AppModule,
			providers: [
				{
					provide: CoreEnvConfig,
					useValue: config,
				},
			],
		};
	}
}

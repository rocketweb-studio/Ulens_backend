import { DynamicModule, Module } from "@nestjs/common";
import { CoreModule } from "@files/core/core.module";
import { CoreEnvConfig } from "@files/core/core.config";
import { StorageModule } from "@files/modules/storage/storage.module";

@Module({
	imports: [CoreModule, StorageModule],
	controllers: [],
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

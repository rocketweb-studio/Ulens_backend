import { DynamicModule, Module } from "@nestjs/common";
import { CoreModule } from "@files/core/core.module";
import { CoreEnvConfig } from "@files/core/core.config";
import { FilesModule } from "./modules/files/files.module";

@Module({
	imports: [CoreModule, FilesModule],
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

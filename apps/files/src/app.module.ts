import { DynamicModule, Module } from "@nestjs/common";
import { CoreModule } from "@files/core/core.module";
import { CoreEnvConfig } from "@files/core/core.config";
import { FilesModule } from "@files/modules/files/files.module";
import { FilesRabbitModule } from "@files/modules/files-rabbit/files-rabbit.module";
import { EventStoreModule } from "@files/modules/event-store/event-store.module";
@Module({
	imports: [CoreModule, FilesModule, FilesRabbitModule, EventStoreModule],
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

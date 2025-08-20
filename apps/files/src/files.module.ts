import { DynamicModule, Module } from "@nestjs/common";
import { FilesController } from "@/files.controller";
import { FilesService } from "@/files.service";
import { CoreModule } from "@/core/core.module";
import { CoreEnvConfig } from "./core/core-env.config";

@Module({
	imports: [CoreModule],
	controllers: [FilesController],
	providers: [FilesService],
})
export class FilesModule {
	static forRoot(config: CoreEnvConfig): DynamicModule {
		return {
			module: FilesModule,
			providers: [
				{
					provide: CoreEnvConfig,
					useValue: config,
				},
			],
		};
	}
}

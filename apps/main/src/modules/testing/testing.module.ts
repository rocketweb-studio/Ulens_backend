import { Module } from "@nestjs/common";
import { CoreModule } from "@main/core/core.module";
import { TestingController } from "./testing.controller";

@Module({
	imports: [CoreModule],
	controllers: [TestingController],
	providers: [],
	exports: [],
})
export class TestingModule {
	// static forRoot(config: CoreEnvConfig): DynamicModule {
	//   return {
	//     module: TestingModule,
	//     providers: [
	//       {
	//         provide: CoreEnvConfig,
	//         useValue: config
	//       }
	//     ]
	//   };
	// }
}

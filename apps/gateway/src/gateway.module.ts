import { DynamicModule, Module } from "@nestjs/common";
import { CoreEnvConfig } from "@gateway/core/core.config";
import { CoreModule } from "@gateway/core/core.module";
import { AuthClientModule } from "@gateway/microservices/auth/auth-client.module";
import { MainClientModule } from "@gateway/microservices/main/main-client.module";
import { NotificationsClientModule } from "@gateway/microservices/notifications/notifications-client.module";
import { FilesClientModule } from "@gateway/microservices/files/files-client.module";
import { RabbitModule } from "@libs/rabbit/index";

@Module({
	imports: [CoreModule, AuthClientModule, MainClientModule, NotificationsClientModule, FilesClientModule, RabbitModule],
	controllers: [],
	providers: [],
})
export class GatewayModule {
	static forRoot(config: CoreEnvConfig): DynamicModule {
		return {
			module: GatewayModule,
			providers: [
				{
					provide: CoreEnvConfig,
					useValue: config,
				},
			],
		};
	}
}

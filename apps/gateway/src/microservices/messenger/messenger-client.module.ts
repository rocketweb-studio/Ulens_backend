import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Microservice } from "@libs/constants/microservices";
import { AuthClientEnvConfig } from "@gateway/microservices/auth/auth-client.config";
import { JwtModule } from "@nestjs/jwt";
import { MessengerClientService } from "@gateway/microservices/messenger/messenger-client.service";
import { MessengerClientController } from "@gateway/microservices/messenger/messenger-client.controller";
import { MessengerClientEnvConfig } from "@gateway/microservices/messenger/messenger-client.config";

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: Microservice.MESSENGER,
				useFactory: (config: MessengerClientEnvConfig) => ({
					transport: Transport.TCP,
					options: {
						host: config.messengerClientHost,
						port: config.messengerClientPort,
					},
				}),
				inject: [MessengerClientEnvConfig],
				extraProviders: [MessengerClientEnvConfig],
			},
		]),
		JwtModule.registerAsync({
			useFactory: (authEnvConfig: AuthClientEnvConfig) => ({
				secret: authEnvConfig.accessTokenSecret,
			}),
			inject: [AuthClientEnvConfig],
			extraProviders: [AuthClientEnvConfig],
		}),
	],
	controllers: [MessengerClientController],
	providers: [MessengerClientService, MessengerClientEnvConfig],
	exports: [MessengerClientService],
})
export class MessengerClientModule {}

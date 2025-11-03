import { RabbitEventBus } from "@libs/rabbit/index";
import { Module } from "@nestjs/common";
import { RMQ_EVENT_BUS } from "@libs/rabbit/index";
import { AuthRabbitConsumer } from "@auth/modules/auth-rabbit/auth-rabbit.consumer";
import { AuthRabbitPublisher } from "@auth/modules/auth-rabbit/auth-rabbit.publisher";
import { UserModule } from "@auth/modules/user/user.module";
import { EventStoreModule } from "@auth/modules/event-store/event-store.module";

@Module({
	imports: [UserModule, EventStoreModule],
	providers: [AuthRabbitConsumer, AuthRabbitPublisher, { provide: RMQ_EVENT_BUS, useClass: RabbitEventBus }],
	exports: [AuthRabbitConsumer],
})
export class AuthRabbitModule {}

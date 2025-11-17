import { Module } from "@nestjs/common";
import { MessengerRabbitConsumer } from "@messenger/modules/messenger-rabbit/messenger-rabbit.consumer";
import { EventStoreModule } from "@messenger/modules/event-store/event-store.module";
import { RMQ_EVENT_BUS } from "@libs/rabbit/rabbit.constants";
import { RabbitEventBus } from "@libs/rabbit/rabbit.event-bus";
import { MessengerModule } from "@messenger/modules/messenger/messenger.module";
import { MessengerRabbitPublisher } from "@messenger/modules/messenger-rabbit/messenger-rabbit.publisher";

@Module({
	imports: [EventStoreModule, MessengerModule],
	providers: [MessengerRabbitConsumer, MessengerRabbitPublisher, { provide: RMQ_EVENT_BUS, useClass: RabbitEventBus }],
	exports: [MessengerRabbitConsumer],
})
export class MessengerRabbitModule {}

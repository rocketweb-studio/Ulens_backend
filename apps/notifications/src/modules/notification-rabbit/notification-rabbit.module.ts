import { Module } from "@nestjs/common";
import { NotificationRabbitConsumer } from "@notifications/modules/notification-rabbit/notification-rabbit.consumer";
import { EventStoreModule } from "@notifications/modules/event-store/event-store.module";
import { EmailModule } from "@notifications/modules/mail/mail.module";
import { NotificationModule } from "@notifications/modules/notification/notification.module";
import { NotificationRabbitPublisher } from "@notifications/modules/notification-rabbit/notification-rabbit.publisher";
import { RMQ_EVENT_BUS } from "@libs/rabbit/rabbit.constants";
import { RabbitEventBus } from "@libs/rabbit/rabbit.event-bus";

@Module({
	imports: [EmailModule, EventStoreModule, NotificationModule],
	providers: [NotificationRabbitConsumer, NotificationRabbitPublisher, { provide: RMQ_EVENT_BUS, useClass: RabbitEventBus }],
	exports: [NotificationRabbitConsumer],
})
export class NotificationRabbitModule {}

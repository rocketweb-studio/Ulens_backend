import { Module } from "@nestjs/common";
import { NotificationRabbitConsumer } from "@notifications/modules/notification-rabbit/notification-rabbit.consumer";
import { EventStoreModule } from "@notifications/modules/event-store/event-store.module";
import { EmailModule } from "@notifications/modules/mail/mail.module";

@Module({
	imports: [EmailModule, EventStoreModule],
	providers: [NotificationRabbitConsumer],
	exports: [NotificationRabbitConsumer],
})
export class NotificationRabbitModule {}

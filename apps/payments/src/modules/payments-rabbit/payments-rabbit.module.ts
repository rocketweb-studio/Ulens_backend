import { RabbitEventBus } from "@libs/rabbit/index";
import { Module } from "@nestjs/common";
import { PaymentsRabbitConsumer } from "@payments/modules/payments-rabbit/payments-rabbit.consumer";
import { PaymentsRabbitPublisher } from "@payments/modules/payments-rabbit/payments-rabbit.publisher";
import { TransactionModule } from "@payments/modules/transaction/transaction.module";
import { EventStoreModule } from "@payments/modules/event-store/event-store.module";
import { RMQ_EVENT_BUS } from "@libs/rabbit/rabbit.constants";
import { SubscriptionModule } from "@payments/modules/subscription/subscription.module";
@Module({
	imports: [TransactionModule, EventStoreModule, SubscriptionModule],
	providers: [PaymentsRabbitConsumer, PaymentsRabbitPublisher, { provide: RMQ_EVENT_BUS, useClass: RabbitEventBus }],
	exports: [PaymentsRabbitConsumer],
})
export class PaymentsRabbitModule {}

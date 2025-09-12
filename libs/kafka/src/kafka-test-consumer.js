// Простой консюмер KafkaJS с ручным коммитом оффсетов.
// Подключение к Redpanda по адресу ХОСТА (из docker-compose): localhost:9094
// Запускаем командой node kafka-test-consumer.js

const { Kafka, logLevel } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'demo-consumer',
  brokers: ['localhost:9094'],   // внешний advertised listener
  logLevel: logLevel.WARN,
});

const TOPIC = 'demo.keys.v1';
const GROUP_ID = 'demo-keys-group-1';

(async () => {
  const consumer = kafka.consumer({ 
		groupId: GROUP_ID, 
		allowAutoTopicCreation: false,
	});

  await consumer.connect();                                   // коннект к брокеру
  await consumer.subscribe({ topic: TOPIC, fromBeginning: true }); // подписка на топик

  console.log(`[consumer] listening ${TOPIC} as ${GROUP_ID}`);

  await consumer.run({
    autoCommit: false,                                        // коммитим оффсеты вручную
		partitionsConsumedConcurrently: 3,					// явно указываем параллелизм
    eachMessage: async ({ topic, partition, message }) => {
      const key = message.key?.toString();
      const value = message.value?.toString();
      console.log(`[consume] ${topic}[p${partition}] offset=${message.offset} key=${key} value=${value}`);

      // считаем сообщение успешно обработанным — фиксируем оффсет
      await consumer.commitOffsets([
        { topic, partition, offset: String(Number(message.offset) + 1) },
      ]);
    },
  });
})().catch((e) => {
  console.error('[consumer] error:', e);
  process.exit(1);
});

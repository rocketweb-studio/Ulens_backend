// Простой продюсер KafkaJS: шлёт 3 сообщения в demo.ping.v1
// Запускаем командой node kafka-test-producer.js

const { Kafka, logLevel } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'demo-producer',
  brokers: ['localhost:9094'],   // внешний listener из docker-compose
  logLevel: logLevel.WARN,
});

const TOPIC = 'demo.ping.v1';

(async () => {
  const producer = kafka.producer({ allowAutoTopicCreation: true }); // dev: авто-создание топика
  await producer.connect();
  console.log(`[producer] connected -> ${TOPIC}`);

  for (let i = 0; i < 3; i++) {
    const payload = { hello: i, at: new Date().toISOString() };
    await producer.send({
      topic: TOPIC,
      messages: [{
        key: String(i),                 // порядок по ключу внутри партиции
        value: JSON.stringify(payload),
        headers: { 'x-trace-id': `demo-${i}` },
      }],
    });
    console.log(`[producer] sent #${i}`, payload);
  }

  await producer.disconnect();
  console.log('[producer] done');
})().catch((e) => {
  console.error('[producer] error:', e);
  process.exit(1);
});

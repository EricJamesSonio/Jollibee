const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["localhost:9092"]
});

const producer = kafka.producer();

async function sendOrderCreated(order) {
  await producer.connect();
  await producer.send({
    topic: "ORDER_CREATED",
    messages: [{ value: JSON.stringify(order) }]
  });
  await producer.disconnect();
}

module.exports = { sendOrderCreated };

const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "payment-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"]
});

const producer = kafka.producer();

async function sendPaymentConfirmed(payment) {
  await producer.connect();
  await producer.send({
    topic: "PAYMENT_CONFIRMED",
    messages: [{ value: JSON.stringify(payment) }]
  });
  await producer.disconnect();
}

module.exports = { sendPaymentConfirmed };

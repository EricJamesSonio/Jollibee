const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: ["localhost:9092"]
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

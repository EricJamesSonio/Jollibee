const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "cart-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"]
});

const producer = kafka.producer();

async function sendCartCheckout(cart) {
  await producer.connect();
  await producer.send({
    topic: "CART_CHECKOUT",
    messages: [{ value: JSON.stringify(cart) }]
  });
  await producer.disconnect();
}

module.exports = { sendCartCheckout };

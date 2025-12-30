const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "cart-service",
  brokers: ["localhost:9092"] // adjust if dockerized
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

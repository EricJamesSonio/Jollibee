const { Kafka } = require("kafkajs");
const { createOrderFromCart } = require("../modules/order/service");

const kafka = new Kafka({
  clientId: "order-service-consumer",
  brokers: ["localhost:9092"]
});

const consumer = kafka.consumer({ groupId: "order-service-group" });

async function runConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "CART_CHECKOUT", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const cart = JSON.parse(message.value.toString());
      await createOrderFromCart(cart);
    }
  });
}

module.exports = { runConsumer };

const { Kafka } = require("kafkajs");
const orderService = require("../modules/order/service");

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "order-service-consumer",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"]
});

const consumer = kafka.consumer({ groupId: "order-service-group" });

async function runConsumer() {
  await consumer.connect();

  await consumer.subscribe({ topic: "CART_CHECKOUT", fromBeginning: false });
  await consumer.subscribe({ topic: "PAYMENT_CONFIRMED", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const payload = JSON.parse(message.value.toString());

      switch (topic) {
        case "CART_CHECKOUT":
          await orderService.createOrderFromCart(payload);
          break;
        case "PAYMENT_CONFIRMED":
          await orderService.handlePaymentConfirmed(payload);
          break;
        default:
          console.warn("Unhandled topic:", topic);
      }
    }
  });
}

module.exports = { runConsumer };

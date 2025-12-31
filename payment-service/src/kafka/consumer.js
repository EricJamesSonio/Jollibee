const { Kafka } = require("kafkajs");
const paymentService = require("../modules/payment/service");

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "payment-service-consumer",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"]
});

const consumer = kafka.consumer({ groupId: "payment-group" });

async function runConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "ORDER_CREATED", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const order = JSON.parse(message.value.toString());
      await paymentService.cacheOrder(order);
    }
  });
}

module.exports = { runConsumer };

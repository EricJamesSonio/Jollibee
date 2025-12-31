const { Kafka } = require("kafkajs");
const paymentService = require("../modules/payment/service");

const kafka = new Kafka({
  clientId: "payment-service-consumer",
  brokers: ["localhost:9092"]
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

const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "order-service",
  brokers: [process.env.KAFKA_BROKER || "kafka:9092"], // Docker-friendly
});

const producer = kafka.producer();

async function sendOrderCreated(order) {
  await producer.connect();
  await producer.send({
    topic: "ORDER_CREATED", // the topic your payment service listens to
    messages: [
      {
        value: JSON.stringify({
          order_id: order.id,
          total: order.total,
        }),
      },
    ],
  });
}

module.exports = { sendOrderCreated };

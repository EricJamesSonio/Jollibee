const { Kafka } = require("kafkajs");
const paymentService = require("../modules/payment/service");

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "payment-service",
  brokers: [process.env.KAFKA_BROKER], // must be kafka:9092
  retry: {
    retries: 10,
    initialRetryTime: 3000,
  },
});

const consumer = kafka.consumer({
  groupId: "payment-service-group",
});

let isRunning = false;

async function runConsumer() {
  if (isRunning) return;

  try {
    await consumer.connect();

    await consumer.subscribe({
      topic: "ORDER_CREATED",
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const order = JSON.parse(message.value.toString());
          await paymentService.cacheOrder(order);
        } catch (err) {
          console.error("Payment consumer message error:", err.message);
        }
      },
    });

    isRunning = true;
    console.log("✅ Kafka consumer connected (payment-service)");
  } catch (err) {
    console.error("❌ Kafka not ready, retrying in 5s...", err.message);
    setTimeout(runConsumer, 5000);
  }
}

// Graceful shutdown (Docker-safe)
process.on("SIGTERM", async () => {
  console.log("Shutting down payment Kafka consumer...");
  await consumer.disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Shutting down payment Kafka consumer...");
  await consumer.disconnect();
  process.exit(0);
});

module.exports = { runConsumer };

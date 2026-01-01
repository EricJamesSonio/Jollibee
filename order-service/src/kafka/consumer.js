const { Kafka } = require("kafkajs");
const orderService = require("../modules/order/service");

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "order-service",
  brokers: [process.env.KAFKA_BROKER], // must be kafka:9092 in Docker
  retry: {
    retries: 10,
    initialRetryTime: 3000,
  },
});

const consumer = kafka.consumer({
  groupId: "order-service-group",
});

let isRunning = false;

async function runConsumer() {
  if (isRunning) return;

  try {
    await consumer.connect();

    await consumer.subscribe({
      topic: "CART_CHECKOUT",
      fromBeginning: false,
    });

    await consumer.subscribe({
      topic: "PAYMENT_CONFIRMED",
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
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
        } catch (err) {
          console.error("Message processing failed:", err.message);
        }
      },
    });

    isRunning = true;
    console.log("✅ Kafka consumer connected (order-service)");
  } catch (err) {
    console.error("❌ Kafka not ready, retrying in 5s...", err.message);
    setTimeout(runConsumer, 5000);
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Shutting down Kafka consumer...");
  await consumer.disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Shutting down Kafka consumer...");
  await consumer.disconnect();
  process.exit(0);
});

module.exports = { runConsumer };

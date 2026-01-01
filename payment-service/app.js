require("dotenv").config();
const express = require("express");
const initDatabase = require("./src/database/init");
const container = require("./src/di/container");
const { runConsumer } = require("./src/kafka/consumer");

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());
app.use("/api", container.routes);
app.use(container.errorMiddleware);

(async () => {
  try {
    await initDatabase();
    console.log("✅ Payment database initialized");

    // Start Kafka consumer safely (non-blocking)
    runConsumer();

    app.listen(PORT, () => {
      console.log(`🚀 Payment Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start Payment Service:", err);
    process.exit(1);
  }
})();

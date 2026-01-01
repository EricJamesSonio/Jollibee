require("dotenv").config();
const express = require("express");
const initDatabase = require("./src/database/init");
const container = require("./src/di/container");
const { runConsumer } = require("./src/kafka/consumer");

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use("/api", container.routes);
app.use(container.errorMiddleware);

(async () => {
  try {
    await initDatabase();
    console.log("✅ Order database initialized");

    // Start Kafka consumer (non-blocking, retry-safe)
    runConsumer();

    app.listen(PORT, () => {
      console.log(`🚀 Order Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start Order Service:", err);
    process.exit(1);
  }
})();

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
  await initDatabase();
  await runConsumer(); // start Kafka consumer
  app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
  });
})();

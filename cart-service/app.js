require("dotenv").config();
const express = require("express");
const initDatabase = require("./src/database/init");
const container = require("./src/di/container");

const app = express();
const PORT = process.env.PORT || 3002; // cart service port

app.use(express.json());
app.use("/api", container.routes);
app.use(container.errorMiddleware);

(async () => {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Cart Service running on port ${PORT}`);
  });
})();

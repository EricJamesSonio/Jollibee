require("dotenv").config();
const express = require("express");

const initDatabase = require("./src/database/init");
const container = require("./src/di/container");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// attach routes
app.use("/api", container.routes);

// error handler
app.use(errorHandler);

// initialize DB and start server
(async () => {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Menu Service running on port ${PORT}`);
  });
})();

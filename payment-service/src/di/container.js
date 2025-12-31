const paymentRoutes = require("../modules/payment/routes");
const errorHandler = require("../middleware/errorHandler");

module.exports = {
  routes: paymentRoutes,
  errorMiddleware: errorHandler
};

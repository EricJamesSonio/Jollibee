const orderRoutes = require("../modules/order/routes");
const errorHandler = require("../middleware/errorHandler");

module.exports = {
  routes: orderRoutes,
  errorMiddleware: errorHandler
};

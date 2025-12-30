const cartRoutes = require("../modules/cart/routes");
const errorHandler = require("../middleware/errorHandler");

module.exports = {
  routes: cartRoutes,
  errorMiddleware: errorHandler
};

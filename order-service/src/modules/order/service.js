const repository = require("./repository");
const { sendOrderCreated } = require("../../kafka/producer");

module.exports = {
  async createOrderFromCart(cart) {
    const order = {
      status: "PENDING",
      total: cart.total,
      items: cart.items
    };
    const savedOrder = await repository.createOrder(order);
    await sendOrderCreated(savedOrder);
    return savedOrder;
  },

  async getPendingOrders() {
    return repository.getPendingOrders();
  },

  async completeOrder(id) {
    return repository.markOrderComplete(id);
  }
};

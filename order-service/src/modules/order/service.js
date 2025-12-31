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

    // 🔥 emit event
    await sendOrderCreated(savedOrder);

    return savedOrder;
  },

  async getPendingOrders() {
    return repository.getPendingOrders();
  },

  async completeOrder(id) {
    return repository.markOrderComplete(id);
  },

  // 🔥 NEW — Kafka consumer entry
  async handlePaymentConfirmed(event) {
    const { order_id } = event;
    if (!order_id) throw new Error("order_id missing in PAYMENT_CONFIRMED");

    return repository.markOrderPaid(order_id);
  }
};

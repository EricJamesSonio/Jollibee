const repository = require("./repository");
const { sendPaymentConfirmed } = require("../../kafka/producer");

const pendingOrders = new Map(); // order_id -> order

module.exports = {
  cacheOrder(order) {
    pendingOrders.set(order.id, order);
  },

  async processPayment(orderId, amountPaid) {
    const order = pendingOrders.get(Number(orderId));
    if (!order) throw new Error("Order not found");

    if (amountPaid < order.total) {
      throw new Error("Insufficient payment");
    }

    const change = amountPaid - order.total;

    const payment = await repository.savePayment({
      order_id: order.id,
      total: order.total,
      amount_paid: amountPaid,
      change
    });

    await sendPaymentConfirmed({
      order_id: order.id,
      payment_id: payment.id
    });

    pendingOrders.delete(order.id);
    return payment;
  }
};
